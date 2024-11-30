import React from "react";
import { useInstrumentation } from "../providers/Instrumentation/context";
import { Home as HomeScreen } from "../pages/Home";

export interface HomeScreenContainerProps {}

const Home: React.ComponentType<HomeScreenContainerProps> = () => {
    const { tracer } = useInstrumentation();

    return (
        <HomeScreen tracer={tracer} />
    )
}

export default Home;