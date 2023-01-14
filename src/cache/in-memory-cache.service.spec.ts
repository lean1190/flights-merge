import { Test, TestingModule } from '@nestjs/testing';

import { InMemoryCacheService } from './in-memory-cache.service';

describe('InMemoryCacheService', () => {
    let service: InMemoryCacheService<any>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InMemoryCacheService],
        }).compile();

        service = module.get<InMemoryCacheService<any>>(InMemoryCacheService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
