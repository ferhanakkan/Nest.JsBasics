import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entitiy';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
        return this.taskService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
         return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    async updateTaskById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
        return this.taskService.updateTask(id,status);
    }

    // DB olmadan database ornekleri!!!!
    // // @Get()
    // // getTasks(): Task[] {
    // //     return this.taskService.getAllTasks();
    // // }

    // // @UsePipes(ValidationPipe) // Bu selilde validte edilebilir gelen obje veya Query Icerisinede konulabilir ikiside calisir.
    // @Get()  // Query parametrelerini obje olarak almayi saglar
    // getTasksByDto(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    //     // console.log(filterDto)
    //     if (Object.keys(filterDto).length) {
    //         return this.taskService.getTasksWithFilters(filterDto);
    //     } else {
    //         return this.taskService.getAllTasks();
    //     }
    // }

    // // @Get() // Query uzerinden parametre almak.
    // // getTasksByDto(@Query('id') id: string): Task[] {
    // //         console.log(id)
    // //         return this.taskService.getAllTasks();
    // //  }

    // @Get('/:id')
    // getTaskById(@Param('id') id: string): Task {
    //     return this.taskService.getTaskById(id);
    // }
    
    // @Delete('/:id')
    // deleteTaskById(@Param('id') id: string): void {
    //      this.taskService.deleteTaskById(id);
    // }

    // @Patch('/:id/status')
    // updateTaskById(
    //     @Param('id') id: string,
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    // ): Task {
    //     return this.taskService.updateTask(id,status);
    // }

    // //Data transfer objesi olmadan post medodunu isleme
    // // @Post()
    // // createTask(@Body('title') title: string,
    // //             @Body('description') description: string,): Task {
    // //    return this.taskService.createTask(title,description);
    // // }  

    // @Post()
    // @UsePipes(ValidationPipe)
    // createTask(@Body() createTaskDto: CreateTaskDto): Task {
    //     return this.taskService.createTask(createTaskDto);
    // }

    // // Butun parametreleri yakalayip basmana yariyor diger sekilde hepsini tek tek alman lazim
    // // @Post()
    // // createTask(@Body() body) {
    // //     console.log('body', body);
    // // }
}
