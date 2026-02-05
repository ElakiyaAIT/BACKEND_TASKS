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
} from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { FILE_CONSTANTS } from 'src/common/constants/file.constants';

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
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: FILE_CONSTANTS.MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!FILE_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Only JPG, JPEG, PNG images allowed',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try{

    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const filenames = files.map((file) => file.filename);

    return await this.productsService.create(body, filenames);
    } catch(error){
         throw error instanceof BadRequestException
         ? error: new InternalServerErrorException('Product creation failed');
    }
  }
  // READ ALL
  @Get()
  async findAll() {
    try{
        return await this.productsService.findAll();
    } catch(error){
        throw new InternalServerErrorException('Failed to fetch products');
    }
    
  }

  // READ ONE
  @Get(':id')
   async findOne(@Param('id') id: string) {
    try{
        return await this.productsService.findOne(id);
    } catch(error){
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
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
    limits: {
      fileSize: FILE_CONSTANTS.MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
      if (!FILE_CONSTANTS.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            'Only JPG, JPEG, PNG images allowed',
          ),
          false,
        );
      }
      cb(null, true);
    },
  }),
)
 async update(
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFiles() files?: Express.Multer.File[],
) {
    try{
        const filenames = files?.map((file) => file.filename) || [];
  return await this.productsService.update(id, body, filenames);
    } catch(error){
        throw new InternalServerErrorException('Product update failed');
    }
  
}

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
        return this.productsService.remove(id);
    } catch(error){
        throw new InternalServerErrorException('Product deletion failed');
    }
    
  }

//DELETE PARTICULAR IMAGE
  @Delete(':id/images')
async removeImage(
  @Param('id') productId: string,
  @Body('image') image: string,
) {
    try{
if (!image) {
    throw new BadRequestException('Image filename is required');
  }

  return this.productsService.removeImage(productId, image);
    }
    catch(error){
        throw error instanceof BadRequestException
        ? error:
        new InternalServerErrorException('Image removal failed');
    }
  
}
}
