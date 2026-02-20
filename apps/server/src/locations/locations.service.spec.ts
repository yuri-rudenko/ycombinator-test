import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('LocationsService (Unit)', () => {
  let service: LocationsService;
  let mockCacheManager: any;
  let mockSquareClient: any;

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockSquareClient = {
      locations: {
        list: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: 'SQUARE_CLIENT', useValue: mockSquareClient },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('should filter out inactive locations and return DTOs', async () => {
    mockCacheManager.get.mockResolvedValue(null);
    mockSquareClient.locations.list.mockResolvedValue({
      locations: [
        { id: '1', name: 'Active Store', status: 'ACTIVE', timezone: 'UTC' },
        { id: '2', name: 'Closed Store', status: 'INACTIVE', timezone: 'UTC' },
      ],
    });

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].name).toBe('Active Store');
    expect(mockCacheManager.set).toHaveBeenCalled();
  });
});