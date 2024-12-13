import { A } from '@solidjs/router';
import { type Component } from 'solid-js';

const WelcomePage: Component = () => {
  return (
    <div class="h-screen w-screen flex justify-center items-center">
      <div class="flex flex-row">
        <div class="w-1/2 flex flex-col justify-center items-center">
          <h1 class='text-5xl font-bold text-primary text-pretty'>To-Do-List</h1>
        </div>
        <div class="w-1/2 flex flex-col justify-center">
          <h1 class="text-5xl font-bold text-secondary-content">Welcome to Your Todo List</h1>
          <p class="text-2xl text-secondary mt-5">Organize your tasks, stay on top of your goals.</p>
          <p class="text-lg text-secondary-content mt-5 w-[28rem]">Using Our To-Do app, you will be able to set all your tasks , no matter what kind or type are the todos easily and quickly by saving yourself your precious time and tones of papers</p>
          <A href='/todos' class="btn btn-primary mt-10 w-28">Continue</A>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;