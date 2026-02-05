import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import * as fs from 'fs';
import * as path from 'path';
import { PRODUCT_MESSAGES } from 'src/common/constants/product.constants';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>,
    ) { }

    async create(data: any, images: string[]) {
        try {
            return await this.productModel.create({
                ...data,
                images,
            });
        } catch (error) {
            throw new InternalServerErrorException(PRODUCT_MESSAGES.CREATE_FAILED);
        }
    }

    async findAll() {
        try {
            return await this.productModel.find();
        } catch (error) {
            throw new InternalServerErrorException(PRODUCT_MESSAGES.FETCH_FAILED);
        }

    }

    async findOne(id: string) {
        try {
            const product = await this.productModel.findById(id);
            if (!product) {
                throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND);
            }
            return product;
        } catch (error) {
            throw error instanceof NotFoundException
                ? error : new InternalServerErrorException(PRODUCT_MESSAGES.FETCH_ONE_FAILED);
        }

    }

    async update(id: string, body: any, images: string[]) {
        try {
            const updateData: any = { ...body };

            if (images.length > 0) {
                updateData.$push = { images: { $each: images } };
            }

            return this.productModel.findByIdAndUpdate(id, updateData, {
                new: true,
            });
        } catch (error) {
            throw error instanceof NotFoundException
                ? error : new InternalServerErrorException(PRODUCT_MESSAGES.UPDATE_FAILED);
        }

    }

    async remove(id: string) {
        try {
            const product = await this.productModel.findByIdAndDelete(id);
            if (!product) {
                throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND);
            }
            return { message: PRODUCT_MESSAGES.DELETE_SUCCESS };
        }
        catch (error) {
            throw error instanceof NotFoundException
                ? error : new InternalServerErrorException(PRODUCT_MESSAGES.DELETE_FAILED);
        }
    }

    async removeImage(productId: string, image: string) {
        try {
            const product = await this.productModel.findById(productId);

            if (!product) {
                throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND);
            }

            if (!product.images.includes(image)) {
                throw new NotFoundException(PRODUCT_MESSAGES.IMAGE_NOT_FOUND);
            }

            //  Remove image from DB
            product.images = product.images.filter((img) => img !== image);
            await product.save();

            //  Remove image from filesystem
            const imagePath = path.join(process.cwd(), 'uploads', image);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            return {
                message: PRODUCT_MESSAGES.IMAGE_DELETE_SUCCESS,
                images: product.images,
            };
        } catch (error) {
            throw error instanceof NotFoundException
                ? error :
                new InternalServerErrorException(PRODUCT_MESSAGES.IMAGE_REMOVE_FAILED);
        }

    }
}
