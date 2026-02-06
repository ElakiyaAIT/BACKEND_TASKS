import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from '../services/products.service';
import { FILE_CONSTANTS } from 'src/common/constants/file.constants';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { UpdateProductDto } from 'src/dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // CREATE PRODUCT
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: FILE_CONSTANTS.MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!FILE_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPG, JPEG, PNG images allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
  @Body() body: CreateProductDto,
  @UploadedFiles() files: Express.Multer.File[],
) {
  try {
    const stock = Number(body.stock);

    if (!Number.isFinite(stock)) {
      throw new BadRequestException('Stock must be a valid number');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const filenames = files.map((file) => file.filename);

    return await this.productsService.create(
      { ...body, stock },
      filenames,
    );
  } catch (error) {
    throw error instanceof BadRequestException
      ? error
      : new InternalServerErrorException('Product creation failed');
  }
}


  //FILTER
  @Get('filter')
  filterProducts(
    @Query('name') name?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('inStock') inStock?: 'true' | 'false',
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.productsService.filterProducts({
      name,
      fromDate,
      toDate,
      inStock,
      sortBy,
      order,
    });
  }
  // READ ALL
  @Get()
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productsService.findOne(id);
    } catch {
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  // UPDATE
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: FILE_CONSTANTS.MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!FILE_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPG, JPEG, PNG images allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const filenames = files?.map((file) => file.filename) || [];
      return await this.productsService.update(id, body, filenames);
    } catch {
      throw new InternalServerErrorException('Product update failed');
    }
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.productsService.remove(id);
    } catch {
      throw new InternalServerErrorException('Product deletion failed');
    }
  }

  //DELETE PARTICULAR IMAGE
  @Delete(':id/images')
  async removeImage(
    @Param('id') productId: string,
    @Body('image') image: string,
  ) {
    try {
      if (!image) {
        throw new BadRequestException('Image filename is required');
      }

      return this.productsService.removeImage(productId, image);
    } catch (error) {
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Image removal failed');
    }
  }
}
