import {
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectAclCommand,
    PutObjectCommand,
    PutObjectTaggingCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import AppConfig from 'configs/app.config';
import { Logger } from 'helpers/logger.helper';
import { GenerateUUID } from 'helpers/util.helper';

type UploadObjectToS3Args = {
    data: any;
    path: string;
    access: 'private' | 'public-read';
    contentType: string;
    fileName?: string;
};
@Injectable()
export default class S3Service {
    private _s3Client: S3Client = null;
    private _stsClient: STSClient = null;

    constructor() {
        this._s3Client = new S3Client({
            credentials: {
                accessKeyId: AppConfig.AWS.ACCESS_KEY,
                secretAccessKey: AppConfig.AWS.SECRET_KEY,
            },
            region: AppConfig.AWS.REGION,
        });

        this._stsClient = new STSClient({
            credentials: {
                accessKeyId: AppConfig.AWS.ACCESS_KEY,
                secretAccessKey: AppConfig.AWS.SECRET_KEY,
            },
            region: AppConfig.AWS.REGION,
        });
    }

    private _createUniqueFileName(name: string): string {
        return GenerateUUID() + '__' + encodeURIComponent(name);
    }

    private _generateS3ResourceARN(resource: string) {
        return `arn:aws:s3:::${AppConfig.AWS.BUCKET}/${resource}`;
    }

    private _generateUniqueRoleSessionName(id: number) {
        return `mediaupload-${id}`;
    }

    private _generateSTSPolicy(resource: string) {
        return {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'VisualEditor0',
                    Effect: 'Allow',
                    Action: [
                        's3:PutObject',
                        's3:AbortMultipartUpload',
                        's3:PutObjectAcl',
                        's3:GetObject',
                        's3:ListMultipartUploadParts',
                    ],
                },
            ],
            Resource: this._generateS3ResourceARN(resource),
        };
    }

    public CreateUniqueFilePath(fileName: string, type: MediaType): string {
        const date = new Date();
        return `media/${type}/${date.getFullYear()}/${
            date.getMonth() + 1
        }/${date.getDate()}/${date.getMilliseconds()}__${this._createUniqueFileName(fileName)}`;
    }

    async GetFileUploadPermissions(path: string, mediaId: number) {
        const command = new AssumeRoleCommand({
            RoleArn: AppConfig.AWS.STS_ROLE_ARN,
            RoleSessionName: this._generateUniqueRoleSessionName(mediaId),
            DurationSeconds: 60 * 60 * 4,
            Policy: JSON.stringify(this._generateSTSPolicy(path)),
        });
        const { Credentials } = await this._stsClient.send(command);

        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            filePath: path,
        };
    }

    async GetObjectHead(path: string) {
        const command = new HeadObjectCommand({
            Bucket: AppConfig.AWS.BUCKET,
            Key: path,
        });
        const result = await this._s3Client.send(command);

        return {
            contentType: result.ContentType,
            contentLength: result.ContentLength / 1024, // KB
            ...(!!result.Metadata?.['x-amz-duration'] && {
                duration: result.Metadata['x-amz-duration'],
            }),
        };
    }

    async UpdateObjectIdTag(path: string, id: number) {
        const command = new PutObjectTaggingCommand({
            Bucket: AppConfig.AWS.BUCKET,
            Key: path,
            Tagging: { TagSet: [{ Key: 'id', Value: `${id}` }] },
        });

        await this._s3Client.send(command);
    }

    async UpdateObjectStaleTag(path: string) {
        const command = new PutObjectTaggingCommand({
            Bucket: AppConfig.AWS.BUCKET,
            Key: path,
            Tagging: { TagSet: [{ Key: 'stale', Value: 'true' }] },
        });

        await this._s3Client.send(command);
    }

    async UpdateObjectAccess(path: string, access: 'public-read' | 'private') {
        const command = new PutObjectAclCommand({
            Bucket: AppConfig.AWS.BUCKET,
            Key: path,
            ACL: access,
        });
        await this._s3Client.send(command);
        return true;
    }

    async GetSignedUrl(path: string) {
        const command = new GetObjectCommand({
            Bucket: AppConfig.AWS.BUCKET,
            Key: path,
        });

        return await getSignedUrl(this._s3Client, command, { expiresIn: 10800 });
    }

    async Upload(data: UploadObjectToS3Args) {
        const command = new PutObjectCommand({
            Bucket: AppConfig.AWS.BUCKET,
            Key: data.path,
            ACL: data.access,
            ContentType: data.contentType,
            Body: data.data,
            ...(!!data.fileName && {
                ContentDisposition: `attachment; fileName="${data.fileName}"`,
            }),
        });
        await this._s3Client.send(command);
        Logger.Info('Successfully uploaded file to S3', '[MEDIA]');
    }
}
