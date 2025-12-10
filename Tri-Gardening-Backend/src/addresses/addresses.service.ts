import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/users/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository, Not } from 'typeorm'; 
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto, user: User): Promise<Address> {
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    return this.addressRepository.save(address);
  }

  async findAllForUser(user: User): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: user.id } },
      order: { isDefault: 'DESC', id: 'ASC' } 
    });
  }
  
  private async findOneForUser(id: string, user: User): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id, user: { id: user.id } }});
    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found or you do not have permission to access it.`);
    }
    return address;
  }

  async setDefault(id: string, user: User): Promise<Address> {
    const newDefaultAddress = await this.findOneForUser(id, user); 

    await this.addressRepository.update(
        { user: { id: user.id }, id: Not(id) }, 
        { isDefault: false }
    );
    
    newDefaultAddress.isDefault = true;
    return this.addressRepository.save(newDefaultAddress);
  }

  async update(id: string, updateAddressDto: UpdateAddressDto, user: User): Promise<Address> {
    const address = await this.findOneForUser(id, user);
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }
  
  async remove(id: string, user: User): Promise<void> {
    const address = await this.findOneForUser(id, user);
    await this.addressRepository.remove(address);
  }
}