import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entitiy';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entitiy';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User,
        ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(
        id: number,
        user: User,
        ): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: {id,userId: user.id} });

        if (!found) {
            throw new NotFoundException(`Gonderilen id bulunamadi. Gonderilen id: "${id}" `);
        } 

        return found;
    }
    
    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(
        id: number,
        user: User
        ): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        
        if (result.affected === 0) { 
            throw new NotFoundException(`Gonderilen id bulunamadi. Gonderilen id: "${id}" `);
        }
    }

    async updateTask(
        id: number, 
        status: TaskStatus,
        user: User,
        ): Promise<Task> { 
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    // Database olmadan logic islemler ornekleri!!!
    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if (!found) {
    //        //throw new NotFoundException(); // 404 Hatasi doner Custom icin asagidakini yap
    //        throw new NotFoundException(`Gonderilen id bulunamadi. Gonderilen id: "${id}" `); 
    //     }
    //     return found;
    // }

    // deleteTaskById(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id); 
    // }

    // updateTask(id: string, status: TaskStatus): Task { 
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }

    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => 
    //         task.title.includes(search) || task.description.includes(search),     
    //         );
    //     }

    //     return tasks; 
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title,description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title, // title = title ile yazmakla adlari ayni oldugu icin.
    //         description,
    //         status: TaskStatus.OPEN,
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }

    // // Data transfer objesi olmadan parametre gecisi
    // // createTask(title: string, description: string): Task {
    // //     const task: Task = {
    // //         id: uuid(),
    // //         title, // title = title ile yazmakla adlari ayni oldugu icin.
    // //         description,
    // //         status: TaskStatus.OPEN,
    // //     };

    // //     this.tasks.push(task);
    // //     return task;
    // // }
}