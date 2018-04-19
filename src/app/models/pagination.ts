
export class Pagination {
    constructor(
        public itemsPerPage: number = 10,
        public total_items_count: number = 1,
        public page: number = 1,
        public previousPage: number = 0,
        public pageSize: number = 10
    ){

    }
}