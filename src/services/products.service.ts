import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import * as fs from 'fs';
import * as path from 'path';
import {
  PRODUCT_MESSAGES,
  PRODUCT_SORT_CONSTANTS,
} from 'src/common/constants/product.constants';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { UpdateProductDto } from 'src/dtos/update-product.dto';
import { FilterProductDto } from 'src/dtos/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async create(data: CreateProductDto, images: string[]) {
    try {
      return await this.productModel.create({
        ...data,
        stock: Number(data.stock),
        images,
      });
    } catch {
      throw new InternalServerErrorException(PRODUCT_MESSAGES.CREATE_FAILED);
    }
  }

  async findAll() {
    try {
      return await this.productModel.find();
    } catch {
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
        ? error
        : new InternalServerErrorException(PRODUCT_MESSAGES.FETCH_ONE_FAILED);
    }
  }

  async update(id: string, body: UpdateProductDto, images: string[]) {
    try {
      const updateData: Partial<UpdateProductDto> & {
        $push?: {
          images: { $each: string[] };
        };
      } = { ...body };

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
        ? error
        : new InternalServerErrorException(PRODUCT_MESSAGES.UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productModel.findByIdAndDelete(id);
      if (!product) {
        throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND);
      }
      return { message: PRODUCT_MESSAGES.DELETE_SUCCESS };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(PRODUCT_MESSAGES.DELETE_FAILED);
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
        ? error
        : new InternalServerErrorException(
            PRODUCT_MESSAGES.IMAGE_REMOVE_FAILED,
          );
    }
  }

  async filterProducts(filters: FilterProductDto) {
    try {
      const query: Record<string, unknown> = {};

      // 🔍 Filter by name
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
          (query.createdAt as Record<string, Date>).$gte = new Date(
            filters.fromDate,
          );
        }

        if (filters.toDate) {
          (query.createdAt as Record<string, Date>).$lte = new Date(
            filters.toDate,
          );
        }
      }

      // 📦 Filter by stock
      if (filters.inStock !== undefined) {
        query.stock = filters.inStock === 'true' ? { $gt: 0 } : { $lte: 0 };
      }

      let sort: Record<string, 1 | -1> = { createdAt: -1 };

      if (
        filters.sortBy &&
        PRODUCT_SORT_CONSTANTS.ALLOWED_SORT_FIELDS.includes(filters.sortBy)
      ) {
        sort = {
          [filters.sortBy]: filters.order === 'asc' ? 1 : -1,
        };
      }

      return this.productModel.find(query).sort(sort);
    } catch {
      throw new InternalServerErrorException(PRODUCT_MESSAGES.FETCH_FAILED);
    }
  }
}
