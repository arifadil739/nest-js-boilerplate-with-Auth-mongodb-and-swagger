import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Customer, CustomerDocument } from 'src/schemas/customer.schema';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: SoftDeleteModel<CustomerDocument>,
  ){}

  async create(customer: Partial<Customer>) {
    return await this.customerModel.create(customer)
  }

  async generateToken(user: any) {
    // const token = await this.jwtService.signAsync(user, { expiresIn: '1d' });
    // return token;
    return "token"
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
