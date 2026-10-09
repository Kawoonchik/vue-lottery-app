export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password?: string
  age: number
  gender: string
  phone: string
  image?: string
}

// Omit створює новий тип, беручи всі поля з User, окрім 'id'
export type CreateUserDto = Omit<User, 'id'>

// Partial робить усі поля типу CreateUserDto необов'язковими (для оновлення частини даних)
export type UpdateUserDto = Partial<CreateUserDto>
