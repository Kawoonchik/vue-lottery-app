export interface Readable<T> {
  getAll(params?: {
    limit?: number
    skip?: number
    q?: string
  }): Promise<{ items: T[]; total: number }>
  getById(id: number | string): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number | string, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number | string): Promise<void>
}
