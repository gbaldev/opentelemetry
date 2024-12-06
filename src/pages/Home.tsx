import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Header } from "../components/Header";
import { Task, TasksList } from "../components/TasksList";
import { TodoInput } from "../components/TodoInput";
import tracing from "../instrumentation/Tracer";
import Metrics from "../instrumentation/Metrics";

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(newTaskTitle: string) {
    const hasTaskWithThisName =
      tasks.findIndex((task) => task.title === newTaskTitle) > -1;

    if (hasTaskWithThisName) {
      Alert.alert(
        "Task já cadastrada",
        "Você não pode cadastrar uma task com o mesmo nome"
      );
    } else {
      setTasks([
        ...tasks,
        {
          id: new Date().getTime(),
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
    const span = tracing.startSpan('Screen focused');
    span.setAttribute('focused_screen', 'Home');
    setTimeout(() => {
      span.end();
    }, 10000);

    const aver = async () => {
      try {
        const payload = {
          "timeseries": [
            {
              "labels": [
                {"name": "job", "value": "api"},
                {"name": "instance", "value": "localhost:9090"}
              ],
              "samples": [
                {
                  "timestamp_ms": 1609459200000,
                  "value": 123.45
                },
                {
                  "timestamp_ms": 1609459260000,
                  "value": 130.60
                }
              ],
              "exemplars": [],
              "histograms": []
            }
          ],
          "source": "API",
          "metadata": [
            {
              "type": "GAUGE",
              "metric_family_name": "my_metric_family",
              "help": "This is a test metric",
              "unit": "seconds"
            }
          ],
          "skip_label_validation": false,
          "skip_label_count_validation": false
        };
        Metrics.sendMetric(payload as any);

      } catch (e) {
        console.log(e);
      }
    }
    aver();
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
