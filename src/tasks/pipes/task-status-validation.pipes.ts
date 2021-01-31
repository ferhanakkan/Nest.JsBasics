import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: any, metada: ArgumentMetadata) {
        //BU kismi servisten gelen custom datayi valide etmek icin kullaniyoruz. Status durumunun custom enumlar ile belirlemistik.
        // Argument Metada valuenun gelis bilgilerini iceriyor metada { metatype: [Function: String], type: 'body', data: 'status' }
        // console.log(`value`, value);
        // console.log(`metada`, metada);
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" gecerli bir status degil`)
        }
        return value;
    }

    private isStatusValid(status: any): boolean {
     const index = this.allowedStatus.indexOf(status);
     return index !== -1;
    }
}