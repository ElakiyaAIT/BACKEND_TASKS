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
import { PRODUCT_MESSAGES, PRODUCT_SORT_CONSTANTS } from 'src/common/constants/product.constants';

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
                stock:Number(data.stock),
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

            if (body.stock !== undefined) {
                updateData.stock = Number(body.stock);
            }
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

     async filterProducts(filters: {
    name?: string;
    fromDate?: string;
    toDate?: string;
    inStock?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    try{
const query: any = {};

    // 🔍 Filter by name (case-insensitive)
    if (filters.name) {
      query.name = {
        $regex: filters.name,
        $options: 'i',
      };
    }

    // 📅 Filter by created date
    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};

      if (filters.fromDate) {
        query.createdAt.$gte = new Date(filters.fromDate);
      }

      if (filters.toDate) {
        query.createdAt.$lte = new Date(filters.toDate);
      }
    }

    // 📦 Filter by stock availability
    if (filters.inStock !== undefined) {
      if (filters.inStock === 'true') {
        query.stock = { $gt: 0 };
      }

      if (filters.inStock === 'false') {
        query.stock = { $lte: 0 };
      }
    }
     let sort: any = { createdAt: -1 }; // default

    if (
      filters.sortBy &&
      PRODUCT_SORT_CONSTANTS.ALLOWED_SORT_FIELDS.includes(filters.sortBy)
    ) {
      sort = {
        [filters.sortBy]: filters.order === 'asc' ? 1 : -1,
      };
    }

    return this.productModel.find(query).sort(sort);
  } catch(error){
    throw new InternalServerErrorException(PRODUCT_MESSAGES.FETCH_FAILED);
  }
    }
    
}
