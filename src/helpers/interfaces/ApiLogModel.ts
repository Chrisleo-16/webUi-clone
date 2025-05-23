export interface ApiLogModel {
    id: number;
    method: string;
    endpoint: string;
    timeCalled: string; 
    status: number;
    errorMessage: string;
    additionalInfo: string;
    objectName: string | null;
    isAsNotificationRead:boolean;
    createdAt: string; 
    updatedAt: string; 
}
