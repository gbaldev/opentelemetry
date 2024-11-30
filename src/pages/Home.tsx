import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { Header } from "../components/Header";
import { Task, TasksList } from "../components/TasksList";
import { TodoInput } from "../components/TodoInput";
import { Instrumentation } from "../instrumentation";

interface HomeProps {
  instrumentation: Instrumentation;
}

export const Home: React.ComponentType<HomeProps> = ({
  instrumentation,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inFocus, setInFocus] = useState(false);

  function handleAddTask(newTaskTitle: string) {
    const hasTaskWithThisName =
      tasks.findIndex((task) => task.title === newTaskTitle) > -1;

    if (hasTaskWithThisName) {
      Alert.alert(
        "Task já cadastrada",
        "Você não pode cadastrar uma task com o mesmo nome"
      );
    } else {
      const id = new Date().getTime();
      instrumentation.meter.registerCreate(id);
      setTasks([
        ...tasks,
        {
          id,
          title: newTaskTitle,
          done: false,
        },
      ]);
    }
  }

  function handleToggleTaskDone(id: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          done: !task.done,
        };
      }

      return task;
    });

    setTasks(newTasks);
  }

  function handleRemoveTask(id: number) {
    const newTasks = tasks.filter((task) => task.id !== id);
    instrumentation.meter.registerDelete(id);
    setTasks(newTasks);
  }

  function handleUpdateTaskName(id: number, newTaskName: string) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title: newTaskName,
        };
      }

      return task;
    });

    setTasks(newTasks);
  }

  useEffect(() => {
    const startTime = Date.now();  // Hora de inicio cuando entra en foco
    const span = instrumentation.tracing.startSpan('screen-focus');  // Iniciar el span para rastrear el foco

    // Establecer atributos del span
    span.setAttribute('screen', 'MyScreen');
    span.setAttribute('status', 'active');

    // Cuando el componente se desmonta (sale del foco)
    return () => {
      const duration = Date.now() - startTime;  // Calcular el tiempo que estuvo en foco
      span.setAttribute('duration', duration);  // Añadir la duración como atributo
      span.end();  // Finalizar el span
    };
  }, [inFocus]);

  useEffect(() => {
    setInFocus(true);
    return () => {
      setInFocus(false);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList
        tasks={tasks}
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask}
        updateTaskName={handleUpdateTaskName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
  },
});
