
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model LoginCode
 * 
 */
export type LoginCode = $Result.DefaultSelection<Prisma.$LoginCodePayload>
/**
 * Model PasswordResetCode
 * 
 */
export type PasswordResetCode = $Result.DefaultSelection<Prisma.$PasswordResetCodePayload>
/**
 * Model PendingRegistration
 * 
 */
export type PendingRegistration = $Result.DefaultSelection<Prisma.$PendingRegistrationPayload>
/**
 * Model Wallet
 * 
 */
export type Wallet = $Result.DefaultSelection<Prisma.$WalletPayload>
/**
 * Model Loan
 * 
 */
export type Loan = $Result.DefaultSelection<Prisma.$LoanPayload>
/**
 * Model Provider
 * 
 */
export type Provider = $Result.DefaultSelection<Prisma.$ProviderPayload>
/**
 * Model ProviderWallet
 * 
 */
export type ProviderWallet = $Result.DefaultSelection<Prisma.$ProviderWalletPayload>
/**
 * Model LoanFunding
 * 
 */
export type LoanFunding = $Result.DefaultSelection<Prisma.$LoanFundingPayload>
/**
 * Model ProviderCredit
 * 
 */
export type ProviderCredit = $Result.DefaultSelection<Prisma.$ProviderCreditPayload>
/**
 * Model Employee
 * 
 */
export type Employee = $Result.DefaultSelection<Prisma.$EmployeePayload>
/**
 * Model AdminActivity
 * 
 */
export type AdminActivity = $Result.DefaultSelection<Prisma.$AdminActivityPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginCode`: Exposes CRUD operations for the **LoginCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginCodes
    * const loginCodes = await prisma.loginCode.findMany()
    * ```
    */
  get loginCode(): Prisma.LoginCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetCode`: Exposes CRUD operations for the **PasswordResetCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetCodes
    * const passwordResetCodes = await prisma.passwordResetCode.findMany()
    * ```
    */
  get passwordResetCode(): Prisma.PasswordResetCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pendingRegistration`: Exposes CRUD operations for the **PendingRegistration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PendingRegistrations
    * const pendingRegistrations = await prisma.pendingRegistration.findMany()
    * ```
    */
  get pendingRegistration(): Prisma.PendingRegistrationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wallet`: Exposes CRUD operations for the **Wallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wallets
    * const wallets = await prisma.wallet.findMany()
    * ```
    */
  get wallet(): Prisma.WalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loan`: Exposes CRUD operations for the **Loan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Loans
    * const loans = await prisma.loan.findMany()
    * ```
    */
  get loan(): Prisma.LoanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.provider`: Exposes CRUD operations for the **Provider** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Providers
    * const providers = await prisma.provider.findMany()
    * ```
    */
  get provider(): Prisma.ProviderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.providerWallet`: Exposes CRUD operations for the **ProviderWallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProviderWallets
    * const providerWallets = await prisma.providerWallet.findMany()
    * ```
    */
  get providerWallet(): Prisma.ProviderWalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loanFunding`: Exposes CRUD operations for the **LoanFunding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoanFundings
    * const loanFundings = await prisma.loanFunding.findMany()
    * ```
    */
  get loanFunding(): Prisma.LoanFundingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.providerCredit`: Exposes CRUD operations for the **ProviderCredit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProviderCredits
    * const providerCredits = await prisma.providerCredit.findMany()
    * ```
    */
  get providerCredit(): Prisma.ProviderCreditDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.employee`: Exposes CRUD operations for the **Employee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Employees
    * const employees = await prisma.employee.findMany()
    * ```
    */
  get employee(): Prisma.EmployeeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminActivity`: Exposes CRUD operations for the **AdminActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminActivities
    * const adminActivities = await prisma.adminActivity.findMany()
    * ```
    */
  get adminActivity(): Prisma.AdminActivityDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    LoginCode: 'LoginCode',
    PasswordResetCode: 'PasswordResetCode',
    PendingRegistration: 'PendingRegistration',
    Wallet: 'Wallet',
    Loan: 'Loan',
    Provider: 'Provider',
    ProviderWallet: 'ProviderWallet',
    LoanFunding: 'LoanFunding',
    ProviderCredit: 'ProviderCredit',
    Employee: 'Employee',
    AdminActivity: 'AdminActivity'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "loginCode" | "passwordResetCode" | "pendingRegistration" | "wallet" | "loan" | "provider" | "providerWallet" | "loanFunding" | "providerCredit" | "employee" | "adminActivity"
      txIsolationLevel: never
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      LoginCode: {
        payload: Prisma.$LoginCodePayload<ExtArgs>
        fields: Prisma.LoginCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          findFirst: {
            args: Prisma.LoginCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          findMany: {
            args: Prisma.LoginCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>[]
          }
          create: {
            args: Prisma.LoginCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          createMany: {
            args: Prisma.LoginCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LoginCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          update: {
            args: Prisma.LoginCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          deleteMany: {
            args: Prisma.LoginCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoginCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginCodePayload>
          }
          aggregate: {
            args: Prisma.LoginCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginCode>
          }
          groupBy: {
            args: Prisma.LoginCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginCodeGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.LoginCodeFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.LoginCodeAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.LoginCodeCountArgs<ExtArgs>
            result: $Utils.Optional<LoginCodeCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetCode: {
        payload: Prisma.$PasswordResetCodePayload<ExtArgs>
        fields: Prisma.PasswordResetCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          findFirst: {
            args: Prisma.PasswordResetCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          findMany: {
            args: Prisma.PasswordResetCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>[]
          }
          create: {
            args: Prisma.PasswordResetCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          createMany: {
            args: Prisma.PasswordResetCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PasswordResetCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          update: {
            args: Prisma.PasswordResetCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasswordResetCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          aggregate: {
            args: Prisma.PasswordResetCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetCode>
          }
          groupBy: {
            args: Prisma.PasswordResetCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCodeGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PasswordResetCodeFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PasswordResetCodeAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PasswordResetCodeCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCodeCountAggregateOutputType> | number
          }
        }
      }
      PendingRegistration: {
        payload: Prisma.$PendingRegistrationPayload<ExtArgs>
        fields: Prisma.PendingRegistrationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PendingRegistrationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PendingRegistrationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          findFirst: {
            args: Prisma.PendingRegistrationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PendingRegistrationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          findMany: {
            args: Prisma.PendingRegistrationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>[]
          }
          create: {
            args: Prisma.PendingRegistrationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          createMany: {
            args: Prisma.PendingRegistrationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PendingRegistrationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          update: {
            args: Prisma.PendingRegistrationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          deleteMany: {
            args: Prisma.PendingRegistrationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PendingRegistrationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PendingRegistrationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PendingRegistrationPayload>
          }
          aggregate: {
            args: Prisma.PendingRegistrationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePendingRegistration>
          }
          groupBy: {
            args: Prisma.PendingRegistrationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PendingRegistrationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PendingRegistrationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PendingRegistrationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PendingRegistrationCountArgs<ExtArgs>
            result: $Utils.Optional<PendingRegistrationCountAggregateOutputType> | number
          }
        }
      }
      Wallet: {
        payload: Prisma.$WalletPayload<ExtArgs>
        fields: Prisma.WalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findFirst: {
            args: Prisma.WalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findMany: {
            args: Prisma.WalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          create: {
            args: Prisma.WalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          createMany: {
            args: Prisma.WalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.WalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          update: {
            args: Prisma.WalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          deleteMany: {
            args: Prisma.WalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          aggregate: {
            args: Prisma.WalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWallet>
          }
          groupBy: {
            args: Prisma.WalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.WalletFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.WalletAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.WalletCountArgs<ExtArgs>
            result: $Utils.Optional<WalletCountAggregateOutputType> | number
          }
        }
      }
      Loan: {
        payload: Prisma.$LoanPayload<ExtArgs>
        fields: Prisma.LoanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          findFirst: {
            args: Prisma.LoanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          findMany: {
            args: Prisma.LoanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>[]
          }
          create: {
            args: Prisma.LoanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          createMany: {
            args: Prisma.LoanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LoanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          update: {
            args: Prisma.LoanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          deleteMany: {
            args: Prisma.LoanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanPayload>
          }
          aggregate: {
            args: Prisma.LoanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoan>
          }
          groupBy: {
            args: Prisma.LoanGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoanGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.LoanFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.LoanAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.LoanCountArgs<ExtArgs>
            result: $Utils.Optional<LoanCountAggregateOutputType> | number
          }
        }
      }
      Provider: {
        payload: Prisma.$ProviderPayload<ExtArgs>
        fields: Prisma.ProviderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          findFirst: {
            args: Prisma.ProviderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          findMany: {
            args: Prisma.ProviderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>[]
          }
          create: {
            args: Prisma.ProviderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          createMany: {
            args: Prisma.ProviderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProviderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          update: {
            args: Prisma.ProviderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          deleteMany: {
            args: Prisma.ProviderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderPayload>
          }
          aggregate: {
            args: Prisma.ProviderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProvider>
          }
          groupBy: {
            args: Prisma.ProviderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ProviderFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ProviderAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ProviderCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderCountAggregateOutputType> | number
          }
        }
      }
      ProviderWallet: {
        payload: Prisma.$ProviderWalletPayload<ExtArgs>
        fields: Prisma.ProviderWalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderWalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderWalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>
          }
          findFirst: {
            args: Prisma.ProviderWalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderWalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>
          }
          findMany: {
            args: Prisma.ProviderWalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>[]
          }
          create: {
            args: Prisma.ProviderWalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>
          }
          createMany: {
            args: Prisma.ProviderWalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProviderWalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>
          }
          update: {
            args: Prisma.ProviderWalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>
          }
          deleteMany: {
            args: Prisma.ProviderWalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderWalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderWalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderWalletPayload>
          }
          aggregate: {
            args: Prisma.ProviderWalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProviderWallet>
          }
          groupBy: {
            args: Prisma.ProviderWalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderWalletGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ProviderWalletFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ProviderWalletAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ProviderWalletCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderWalletCountAggregateOutputType> | number
          }
        }
      }
      LoanFunding: {
        payload: Prisma.$LoanFundingPayload<ExtArgs>
        fields: Prisma.LoanFundingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoanFundingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoanFundingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>
          }
          findFirst: {
            args: Prisma.LoanFundingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoanFundingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>
          }
          findMany: {
            args: Prisma.LoanFundingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>[]
          }
          create: {
            args: Prisma.LoanFundingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>
          }
          createMany: {
            args: Prisma.LoanFundingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LoanFundingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>
          }
          update: {
            args: Prisma.LoanFundingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>
          }
          deleteMany: {
            args: Prisma.LoanFundingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoanFundingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoanFundingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoanFundingPayload>
          }
          aggregate: {
            args: Prisma.LoanFundingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoanFunding>
          }
          groupBy: {
            args: Prisma.LoanFundingGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoanFundingGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.LoanFundingFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.LoanFundingAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.LoanFundingCountArgs<ExtArgs>
            result: $Utils.Optional<LoanFundingCountAggregateOutputType> | number
          }
        }
      }
      ProviderCredit: {
        payload: Prisma.$ProviderCreditPayload<ExtArgs>
        fields: Prisma.ProviderCreditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderCreditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderCreditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>
          }
          findFirst: {
            args: Prisma.ProviderCreditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderCreditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>
          }
          findMany: {
            args: Prisma.ProviderCreditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>[]
          }
          create: {
            args: Prisma.ProviderCreditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>
          }
          createMany: {
            args: Prisma.ProviderCreditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProviderCreditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>
          }
          update: {
            args: Prisma.ProviderCreditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>
          }
          deleteMany: {
            args: Prisma.ProviderCreditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderCreditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderCreditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCreditPayload>
          }
          aggregate: {
            args: Prisma.ProviderCreditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProviderCredit>
          }
          groupBy: {
            args: Prisma.ProviderCreditGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderCreditGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ProviderCreditFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ProviderCreditAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ProviderCreditCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderCreditCountAggregateOutputType> | number
          }
        }
      }
      Employee: {
        payload: Prisma.$EmployeePayload<ExtArgs>
        fields: Prisma.EmployeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmployeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmployeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          findFirst: {
            args: Prisma.EmployeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmployeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          findMany: {
            args: Prisma.EmployeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[]
          }
          create: {
            args: Prisma.EmployeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          createMany: {
            args: Prisma.EmployeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EmployeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          update: {
            args: Prisma.EmployeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          deleteMany: {
            args: Prisma.EmployeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmployeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmployeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          aggregate: {
            args: Prisma.EmployeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmployee>
          }
          groupBy: {
            args: Prisma.EmployeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmployeeGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.EmployeeFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.EmployeeAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.EmployeeCountArgs<ExtArgs>
            result: $Utils.Optional<EmployeeCountAggregateOutputType> | number
          }
        }
      }
      AdminActivity: {
        payload: Prisma.$AdminActivityPayload<ExtArgs>
        fields: Prisma.AdminActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>
          }
          findFirst: {
            args: Prisma.AdminActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>
          }
          findMany: {
            args: Prisma.AdminActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>[]
          }
          create: {
            args: Prisma.AdminActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>
          }
          createMany: {
            args: Prisma.AdminActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AdminActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>
          }
          update: {
            args: Prisma.AdminActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>
          }
          deleteMany: {
            args: Prisma.AdminActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActivityPayload>
          }
          aggregate: {
            args: Prisma.AdminActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminActivity>
          }
          groupBy: {
            args: Prisma.AdminActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminActivityGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.AdminActivityFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.AdminActivityAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.AdminActivityCountArgs<ExtArgs>
            result: $Utils.Optional<AdminActivityCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    loginCode?: LoginCodeOmit
    passwordResetCode?: PasswordResetCodeOmit
    pendingRegistration?: PendingRegistrationOmit
    wallet?: WalletOmit
    loan?: LoanOmit
    provider?: ProviderOmit
    providerWallet?: ProviderWalletOmit
    loanFunding?: LoanFundingOmit
    providerCredit?: ProviderCreditOmit
    employee?: EmployeeOmit
    adminActivity?: AdminActivityOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProviderCountOutputType
   */

  export type ProviderCountOutputType = {
    loanFundings: number
  }

  export type ProviderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loanFundings?: boolean | ProviderCountOutputTypeCountLoanFundingsArgs
  }

  // Custom InputTypes
  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCountOutputType
     */
    select?: ProviderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProviderCountOutputType without action
   */
  export type ProviderCountOutputTypeCountLoanFundingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanFundingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    userNumber: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    nin: string | null
    picture: string | null
    role: string | null
    verified: boolean | null
    suspended: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    userNumber: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    nin: string | null
    picture: string | null
    role: string | null
    verified: boolean | null
    suspended: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    userNumber: number
    email: number
    password: number
    firstName: number
    lastName: number
    nin: number
    picture: number
    role: number
    verified: number
    suspended: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    userNumber?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    nin?: true
    picture?: true
    role?: true
    verified?: true
    suspended?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    userNumber?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    nin?: true
    picture?: true
    role?: true
    verified?: true
    suspended?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    userNumber?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    nin?: true
    picture?: true
    role?: true
    verified?: true
    suspended?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    userNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    nin: string
    picture: string | null
    role: string
    verified: boolean
    suspended: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userNumber?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    nin?: boolean
    picture?: boolean
    role?: boolean
    verified?: boolean
    suspended?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    userNumber?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    nin?: boolean
    picture?: boolean
    role?: boolean
    verified?: boolean
    suspended?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userNumber" | "email" | "password" | "firstName" | "lastName" | "nin" | "picture" | "role" | "verified" | "suspended" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userNumber: string
      email: string
      password: string
      firstName: string
      lastName: string
      nin: string
      picture: string | null
      role: string
      verified: boolean
      suspended: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UserFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UserAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly userNumber: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly nin: FieldRef<"User", 'String'>
    readonly picture: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly verified: FieldRef<"User", 'Boolean'>
    readonly suspended: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User findRaw
   */
  export type UserFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model LoginCode
   */

  export type AggregateLoginCode = {
    _count: LoginCodeCountAggregateOutputType | null
    _min: LoginCodeMinAggregateOutputType | null
    _max: LoginCodeMaxAggregateOutputType | null
  }

  export type LoginCodeMinAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type LoginCodeMaxAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type LoginCodeCountAggregateOutputType = {
    id: number
    email: number
    code: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type LoginCodeMinAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    createdAt?: true
  }

  export type LoginCodeMaxAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    createdAt?: true
  }

  export type LoginCodeCountAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type LoginCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginCode to aggregate.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginCodes
    **/
    _count?: true | LoginCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginCodeMaxAggregateInputType
  }

  export type GetLoginCodeAggregateType<T extends LoginCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginCode[P]>
      : GetScalarType<T[P], AggregateLoginCode[P]>
  }




  export type LoginCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginCodeWhereInput
    orderBy?: LoginCodeOrderByWithAggregationInput | LoginCodeOrderByWithAggregationInput[]
    by: LoginCodeScalarFieldEnum[] | LoginCodeScalarFieldEnum
    having?: LoginCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginCodeCountAggregateInputType | true
    _min?: LoginCodeMinAggregateInputType
    _max?: LoginCodeMaxAggregateInputType
  }

  export type LoginCodeGroupByOutputType = {
    id: string
    email: string
    code: string
    expiresAt: Date
    createdAt: Date
    _count: LoginCodeCountAggregateOutputType | null
    _min: LoginCodeMinAggregateOutputType | null
    _max: LoginCodeMaxAggregateOutputType | null
  }

  type GetLoginCodeGroupByPayload<T extends LoginCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginCodeGroupByOutputType[P]>
            : GetScalarType<T[P], LoginCodeGroupByOutputType[P]>
        }
      >
    >


  export type LoginCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["loginCode"]>



  export type LoginCodeSelectScalar = {
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type LoginCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "code" | "expiresAt" | "createdAt", ExtArgs["result"]["loginCode"]>

  export type $LoginCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginCode"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      code: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["loginCode"]>
    composites: {}
  }

  type LoginCodeGetPayload<S extends boolean | null | undefined | LoginCodeDefaultArgs> = $Result.GetResult<Prisma.$LoginCodePayload, S>

  type LoginCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginCodeCountAggregateInputType | true
    }

  export interface LoginCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginCode'], meta: { name: 'LoginCode' } }
    /**
     * Find zero or one LoginCode that matches the filter.
     * @param {LoginCodeFindUniqueArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginCodeFindUniqueArgs>(args: SelectSubset<T, LoginCodeFindUniqueArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginCodeFindUniqueOrThrowArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeFindFirstArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginCodeFindFirstArgs>(args?: SelectSubset<T, LoginCodeFindFirstArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeFindFirstOrThrowArgs} args - Arguments to find a LoginCode
     * @example
     * // Get one LoginCode
     * const loginCode = await prisma.loginCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginCodes
     * const loginCodes = await prisma.loginCode.findMany()
     * 
     * // Get first 10 LoginCodes
     * const loginCodes = await prisma.loginCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginCodeWithIdOnly = await prisma.loginCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginCodeFindManyArgs>(args?: SelectSubset<T, LoginCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginCode.
     * @param {LoginCodeCreateArgs} args - Arguments to create a LoginCode.
     * @example
     * // Create one LoginCode
     * const LoginCode = await prisma.loginCode.create({
     *   data: {
     *     // ... data to create a LoginCode
     *   }
     * })
     * 
     */
    create<T extends LoginCodeCreateArgs>(args: SelectSubset<T, LoginCodeCreateArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginCodes.
     * @param {LoginCodeCreateManyArgs} args - Arguments to create many LoginCodes.
     * @example
     * // Create many LoginCodes
     * const loginCode = await prisma.loginCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginCodeCreateManyArgs>(args?: SelectSubset<T, LoginCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LoginCode.
     * @param {LoginCodeDeleteArgs} args - Arguments to delete one LoginCode.
     * @example
     * // Delete one LoginCode
     * const LoginCode = await prisma.loginCode.delete({
     *   where: {
     *     // ... filter to delete one LoginCode
     *   }
     * })
     * 
     */
    delete<T extends LoginCodeDeleteArgs>(args: SelectSubset<T, LoginCodeDeleteArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginCode.
     * @param {LoginCodeUpdateArgs} args - Arguments to update one LoginCode.
     * @example
     * // Update one LoginCode
     * const loginCode = await prisma.loginCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginCodeUpdateArgs>(args: SelectSubset<T, LoginCodeUpdateArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginCodes.
     * @param {LoginCodeDeleteManyArgs} args - Arguments to filter LoginCodes to delete.
     * @example
     * // Delete a few LoginCodes
     * const { count } = await prisma.loginCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginCodeDeleteManyArgs>(args?: SelectSubset<T, LoginCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginCodes
     * const loginCode = await prisma.loginCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginCodeUpdateManyArgs>(args: SelectSubset<T, LoginCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LoginCode.
     * @param {LoginCodeUpsertArgs} args - Arguments to update or create a LoginCode.
     * @example
     * // Update or create a LoginCode
     * const loginCode = await prisma.loginCode.upsert({
     *   create: {
     *     // ... data to create a LoginCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginCode we want to update
     *   }
     * })
     */
    upsert<T extends LoginCodeUpsertArgs>(args: SelectSubset<T, LoginCodeUpsertArgs<ExtArgs>>): Prisma__LoginCodeClient<$Result.GetResult<Prisma.$LoginCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginCodes that matches the filter.
     * @param {LoginCodeFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const loginCode = await prisma.loginCode.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: LoginCodeFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a LoginCode.
     * @param {LoginCodeAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const loginCode = await prisma.loginCode.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: LoginCodeAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of LoginCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeCountArgs} args - Arguments to filter LoginCodes to count.
     * @example
     * // Count the number of LoginCodes
     * const count = await prisma.loginCode.count({
     *   where: {
     *     // ... the filter for the LoginCodes we want to count
     *   }
     * })
    **/
    count<T extends LoginCodeCountArgs>(
      args?: Subset<T, LoginCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginCodeAggregateArgs>(args: Subset<T, LoginCodeAggregateArgs>): Prisma.PrismaPromise<GetLoginCodeAggregateType<T>>

    /**
     * Group by LoginCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginCodeGroupByArgs['orderBy'] }
        : { orderBy?: LoginCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginCode model
   */
  readonly fields: LoginCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginCode model
   */
  interface LoginCodeFieldRefs {
    readonly id: FieldRef<"LoginCode", 'String'>
    readonly email: FieldRef<"LoginCode", 'String'>
    readonly code: FieldRef<"LoginCode", 'String'>
    readonly expiresAt: FieldRef<"LoginCode", 'DateTime'>
    readonly createdAt: FieldRef<"LoginCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginCode findUnique
   */
  export type LoginCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode findUniqueOrThrow
   */
  export type LoginCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode findFirst
   */
  export type LoginCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginCodes.
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginCodes.
     */
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * LoginCode findFirstOrThrow
   */
  export type LoginCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Filter, which LoginCode to fetch.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginCodes.
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginCodes.
     */
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * LoginCode findMany
   */
  export type LoginCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Filter, which LoginCodes to fetch.
     */
    where?: LoginCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginCodes to fetch.
     */
    orderBy?: LoginCodeOrderByWithRelationInput | LoginCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginCodes.
     */
    cursor?: LoginCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginCodes.
     */
    skip?: number
    distinct?: LoginCodeScalarFieldEnum | LoginCodeScalarFieldEnum[]
  }

  /**
   * LoginCode create
   */
  export type LoginCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * The data needed to create a LoginCode.
     */
    data: XOR<LoginCodeCreateInput, LoginCodeUncheckedCreateInput>
  }

  /**
   * LoginCode createMany
   */
  export type LoginCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginCodes.
     */
    data: LoginCodeCreateManyInput | LoginCodeCreateManyInput[]
  }

  /**
   * LoginCode update
   */
  export type LoginCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * The data needed to update a LoginCode.
     */
    data: XOR<LoginCodeUpdateInput, LoginCodeUncheckedUpdateInput>
    /**
     * Choose, which LoginCode to update.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode updateMany
   */
  export type LoginCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginCodes.
     */
    data: XOR<LoginCodeUpdateManyMutationInput, LoginCodeUncheckedUpdateManyInput>
    /**
     * Filter which LoginCodes to update
     */
    where?: LoginCodeWhereInput
    /**
     * Limit how many LoginCodes to update.
     */
    limit?: number
  }

  /**
   * LoginCode upsert
   */
  export type LoginCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * The filter to search for the LoginCode to update in case it exists.
     */
    where: LoginCodeWhereUniqueInput
    /**
     * In case the LoginCode found by the `where` argument doesn't exist, create a new LoginCode with this data.
     */
    create: XOR<LoginCodeCreateInput, LoginCodeUncheckedCreateInput>
    /**
     * In case the LoginCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginCodeUpdateInput, LoginCodeUncheckedUpdateInput>
  }

  /**
   * LoginCode delete
   */
  export type LoginCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
    /**
     * Filter which LoginCode to delete.
     */
    where: LoginCodeWhereUniqueInput
  }

  /**
   * LoginCode deleteMany
   */
  export type LoginCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginCodes to delete
     */
    where?: LoginCodeWhereInput
    /**
     * Limit how many LoginCodes to delete.
     */
    limit?: number
  }

  /**
   * LoginCode findRaw
   */
  export type LoginCodeFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LoginCode aggregateRaw
   */
  export type LoginCodeAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LoginCode without action
   */
  export type LoginCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginCode
     */
    select?: LoginCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginCode
     */
    omit?: LoginCodeOmit<ExtArgs> | null
  }


  /**
   * Model PasswordResetCode
   */

  export type AggregatePasswordResetCode = {
    _count: PasswordResetCodeCountAggregateOutputType | null
    _min: PasswordResetCodeMinAggregateOutputType | null
    _max: PasswordResetCodeMaxAggregateOutputType | null
  }

  export type PasswordResetCodeMinAggregateOutputType = {
    id: string | null
    email: string | null
    token: string | null
    code: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCodeMaxAggregateOutputType = {
    id: string | null
    email: string | null
    token: string | null
    code: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCodeCountAggregateOutputType = {
    id: number
    email: number
    token: number
    code: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetCodeMinAggregateInputType = {
    id?: true
    email?: true
    token?: true
    code?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasswordResetCodeMaxAggregateInputType = {
    id?: true
    email?: true
    token?: true
    code?: true
    expiresAt?: true
    createdAt?: true
  }

  export type PasswordResetCodeCountAggregateInputType = {
    id?: true
    email?: true
    token?: true
    code?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetCode to aggregate.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetCodes
    **/
    _count?: true | PasswordResetCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetCodeMaxAggregateInputType
  }

  export type GetPasswordResetCodeAggregateType<T extends PasswordResetCodeAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetCode[P]>
      : GetScalarType<T[P], AggregatePasswordResetCode[P]>
  }




  export type PasswordResetCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetCodeWhereInput
    orderBy?: PasswordResetCodeOrderByWithAggregationInput | PasswordResetCodeOrderByWithAggregationInput[]
    by: PasswordResetCodeScalarFieldEnum[] | PasswordResetCodeScalarFieldEnum
    having?: PasswordResetCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetCodeCountAggregateInputType | true
    _min?: PasswordResetCodeMinAggregateInputType
    _max?: PasswordResetCodeMaxAggregateInputType
  }

  export type PasswordResetCodeGroupByOutputType = {
    id: string
    email: string
    token: string
    code: string
    expiresAt: Date
    createdAt: Date
    _count: PasswordResetCodeCountAggregateOutputType | null
    _min: PasswordResetCodeMinAggregateOutputType | null
    _max: PasswordResetCodeMaxAggregateOutputType | null
  }

  type GetPasswordResetCodeGroupByPayload<T extends PasswordResetCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetCodeGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetCodeGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    token?: boolean
    code?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["passwordResetCode"]>



  export type PasswordResetCodeSelectScalar = {
    id?: boolean
    email?: boolean
    token?: boolean
    code?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type PasswordResetCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "token" | "code" | "expiresAt" | "createdAt", ExtArgs["result"]["passwordResetCode"]>

  export type $PasswordResetCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetCode"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      token: string
      code: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["passwordResetCode"]>
    composites: {}
  }

  type PasswordResetCodeGetPayload<S extends boolean | null | undefined | PasswordResetCodeDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetCodePayload, S>

  type PasswordResetCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetCodeCountAggregateInputType | true
    }

  export interface PasswordResetCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetCode'], meta: { name: 'PasswordResetCode' } }
    /**
     * Find zero or one PasswordResetCode that matches the filter.
     * @param {PasswordResetCodeFindUniqueArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetCodeFindUniqueArgs>(args: SelectSubset<T, PasswordResetCodeFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetCodeFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeFindFirstArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetCodeFindFirstArgs>(args?: SelectSubset<T, PasswordResetCodeFindFirstArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeFindFirstOrThrowArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetCodes
     * const passwordResetCodes = await prisma.passwordResetCode.findMany()
     * 
     * // Get first 10 PasswordResetCodes
     * const passwordResetCodes = await prisma.passwordResetCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetCodeWithIdOnly = await prisma.passwordResetCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetCodeFindManyArgs>(args?: SelectSubset<T, PasswordResetCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetCode.
     * @param {PasswordResetCodeCreateArgs} args - Arguments to create a PasswordResetCode.
     * @example
     * // Create one PasswordResetCode
     * const PasswordResetCode = await prisma.passwordResetCode.create({
     *   data: {
     *     // ... data to create a PasswordResetCode
     *   }
     * })
     * 
     */
    create<T extends PasswordResetCodeCreateArgs>(args: SelectSubset<T, PasswordResetCodeCreateArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetCodes.
     * @param {PasswordResetCodeCreateManyArgs} args - Arguments to create many PasswordResetCodes.
     * @example
     * // Create many PasswordResetCodes
     * const passwordResetCode = await prisma.passwordResetCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetCodeCreateManyArgs>(args?: SelectSubset<T, PasswordResetCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PasswordResetCode.
     * @param {PasswordResetCodeDeleteArgs} args - Arguments to delete one PasswordResetCode.
     * @example
     * // Delete one PasswordResetCode
     * const PasswordResetCode = await prisma.passwordResetCode.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetCode
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetCodeDeleteArgs>(args: SelectSubset<T, PasswordResetCodeDeleteArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetCode.
     * @param {PasswordResetCodeUpdateArgs} args - Arguments to update one PasswordResetCode.
     * @example
     * // Update one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetCodeUpdateArgs>(args: SelectSubset<T, PasswordResetCodeUpdateArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetCodes.
     * @param {PasswordResetCodeDeleteManyArgs} args - Arguments to filter PasswordResetCodes to delete.
     * @example
     * // Delete a few PasswordResetCodes
     * const { count } = await prisma.passwordResetCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetCodeDeleteManyArgs>(args?: SelectSubset<T, PasswordResetCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetCodes
     * const passwordResetCode = await prisma.passwordResetCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetCodeUpdateManyArgs>(args: SelectSubset<T, PasswordResetCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PasswordResetCode.
     * @param {PasswordResetCodeUpsertArgs} args - Arguments to update or create a PasswordResetCode.
     * @example
     * // Update or create a PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.upsert({
     *   create: {
     *     // ... data to create a PasswordResetCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetCode we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetCodeUpsertArgs>(args: SelectSubset<T, PasswordResetCodeUpsertArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetCodes that matches the filter.
     * @param {PasswordResetCodeFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const passwordResetCode = await prisma.passwordResetCode.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PasswordResetCodeFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PasswordResetCode.
     * @param {PasswordResetCodeAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const passwordResetCode = await prisma.passwordResetCode.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PasswordResetCodeAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PasswordResetCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeCountArgs} args - Arguments to filter PasswordResetCodes to count.
     * @example
     * // Count the number of PasswordResetCodes
     * const count = await prisma.passwordResetCode.count({
     *   where: {
     *     // ... the filter for the PasswordResetCodes we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetCodeCountArgs>(
      args?: Subset<T, PasswordResetCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetCodeAggregateArgs>(args: Subset<T, PasswordResetCodeAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetCodeAggregateType<T>>

    /**
     * Group by PasswordResetCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetCodeGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetCode model
   */
  readonly fields: PasswordResetCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetCode model
   */
  interface PasswordResetCodeFieldRefs {
    readonly id: FieldRef<"PasswordResetCode", 'String'>
    readonly email: FieldRef<"PasswordResetCode", 'String'>
    readonly token: FieldRef<"PasswordResetCode", 'String'>
    readonly code: FieldRef<"PasswordResetCode", 'String'>
    readonly expiresAt: FieldRef<"PasswordResetCode", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordResetCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetCode findUnique
   */
  export type PasswordResetCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode findUniqueOrThrow
   */
  export type PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode findFirst
   */
  export type PasswordResetCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetCodes.
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetCodes.
     */
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * PasswordResetCode findFirstOrThrow
   */
  export type PasswordResetCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetCodes.
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetCodes.
     */
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * PasswordResetCode findMany
   */
  export type PasswordResetCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Filter, which PasswordResetCodes to fetch.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetCodes.
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * PasswordResetCode create
   */
  export type PasswordResetCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetCode.
     */
    data: XOR<PasswordResetCodeCreateInput, PasswordResetCodeUncheckedCreateInput>
  }

  /**
   * PasswordResetCode createMany
   */
  export type PasswordResetCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetCodes.
     */
    data: PasswordResetCodeCreateManyInput | PasswordResetCodeCreateManyInput[]
  }

  /**
   * PasswordResetCode update
   */
  export type PasswordResetCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetCode.
     */
    data: XOR<PasswordResetCodeUpdateInput, PasswordResetCodeUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetCode to update.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode updateMany
   */
  export type PasswordResetCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetCodes.
     */
    data: XOR<PasswordResetCodeUpdateManyMutationInput, PasswordResetCodeUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetCodes to update
     */
    where?: PasswordResetCodeWhereInput
    /**
     * Limit how many PasswordResetCodes to update.
     */
    limit?: number
  }

  /**
   * PasswordResetCode upsert
   */
  export type PasswordResetCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetCode to update in case it exists.
     */
    where: PasswordResetCodeWhereUniqueInput
    /**
     * In case the PasswordResetCode found by the `where` argument doesn't exist, create a new PasswordResetCode with this data.
     */
    create: XOR<PasswordResetCodeCreateInput, PasswordResetCodeUncheckedCreateInput>
    /**
     * In case the PasswordResetCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetCodeUpdateInput, PasswordResetCodeUncheckedUpdateInput>
  }

  /**
   * PasswordResetCode delete
   */
  export type PasswordResetCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Filter which PasswordResetCode to delete.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode deleteMany
   */
  export type PasswordResetCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetCodes to delete
     */
    where?: PasswordResetCodeWhereInput
    /**
     * Limit how many PasswordResetCodes to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetCode findRaw
   */
  export type PasswordResetCodeFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PasswordResetCode aggregateRaw
   */
  export type PasswordResetCodeAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PasswordResetCode without action
   */
  export type PasswordResetCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
  }


  /**
   * Model PendingRegistration
   */

  export type AggregatePendingRegistration = {
    _count: PendingRegistrationCountAggregateOutputType | null
    _min: PendingRegistrationMinAggregateOutputType | null
    _max: PendingRegistrationMaxAggregateOutputType | null
  }

  export type PendingRegistrationMinAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    expiresAt: Date | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    nin: string | null
    picture: string | null
    createdAt: Date | null
  }

  export type PendingRegistrationMaxAggregateOutputType = {
    id: string | null
    email: string | null
    code: string | null
    expiresAt: Date | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    nin: string | null
    picture: string | null
    createdAt: Date | null
  }

  export type PendingRegistrationCountAggregateOutputType = {
    id: number
    email: number
    code: number
    expiresAt: number
    passwordHash: number
    firstName: number
    lastName: number
    nin: number
    picture: number
    createdAt: number
    _all: number
  }


  export type PendingRegistrationMinAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    nin?: true
    picture?: true
    createdAt?: true
  }

  export type PendingRegistrationMaxAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    nin?: true
    picture?: true
    createdAt?: true
  }

  export type PendingRegistrationCountAggregateInputType = {
    id?: true
    email?: true
    code?: true
    expiresAt?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    nin?: true
    picture?: true
    createdAt?: true
    _all?: true
  }

  export type PendingRegistrationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingRegistration to aggregate.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PendingRegistrations
    **/
    _count?: true | PendingRegistrationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PendingRegistrationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PendingRegistrationMaxAggregateInputType
  }

  export type GetPendingRegistrationAggregateType<T extends PendingRegistrationAggregateArgs> = {
        [P in keyof T & keyof AggregatePendingRegistration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePendingRegistration[P]>
      : GetScalarType<T[P], AggregatePendingRegistration[P]>
  }




  export type PendingRegistrationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PendingRegistrationWhereInput
    orderBy?: PendingRegistrationOrderByWithAggregationInput | PendingRegistrationOrderByWithAggregationInput[]
    by: PendingRegistrationScalarFieldEnum[] | PendingRegistrationScalarFieldEnum
    having?: PendingRegistrationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PendingRegistrationCountAggregateInputType | true
    _min?: PendingRegistrationMinAggregateInputType
    _max?: PendingRegistrationMaxAggregateInputType
  }

  export type PendingRegistrationGroupByOutputType = {
    id: string
    email: string
    code: string
    expiresAt: Date
    passwordHash: string
    firstName: string
    lastName: string
    nin: string
    picture: string | null
    createdAt: Date
    _count: PendingRegistrationCountAggregateOutputType | null
    _min: PendingRegistrationMinAggregateOutputType | null
    _max: PendingRegistrationMaxAggregateOutputType | null
  }

  type GetPendingRegistrationGroupByPayload<T extends PendingRegistrationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PendingRegistrationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PendingRegistrationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PendingRegistrationGroupByOutputType[P]>
            : GetScalarType<T[P], PendingRegistrationGroupByOutputType[P]>
        }
      >
    >


  export type PendingRegistrationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    nin?: boolean
    picture?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pendingRegistration"]>



  export type PendingRegistrationSelectScalar = {
    id?: boolean
    email?: boolean
    code?: boolean
    expiresAt?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    nin?: boolean
    picture?: boolean
    createdAt?: boolean
  }

  export type PendingRegistrationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "code" | "expiresAt" | "passwordHash" | "firstName" | "lastName" | "nin" | "picture" | "createdAt", ExtArgs["result"]["pendingRegistration"]>

  export type $PendingRegistrationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PendingRegistration"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      code: string
      expiresAt: Date
      passwordHash: string
      firstName: string
      lastName: string
      nin: string
      picture: string | null
      createdAt: Date
    }, ExtArgs["result"]["pendingRegistration"]>
    composites: {}
  }

  type PendingRegistrationGetPayload<S extends boolean | null | undefined | PendingRegistrationDefaultArgs> = $Result.GetResult<Prisma.$PendingRegistrationPayload, S>

  type PendingRegistrationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PendingRegistrationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PendingRegistrationCountAggregateInputType | true
    }

  export interface PendingRegistrationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PendingRegistration'], meta: { name: 'PendingRegistration' } }
    /**
     * Find zero or one PendingRegistration that matches the filter.
     * @param {PendingRegistrationFindUniqueArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PendingRegistrationFindUniqueArgs>(args: SelectSubset<T, PendingRegistrationFindUniqueArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PendingRegistration that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PendingRegistrationFindUniqueOrThrowArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PendingRegistrationFindUniqueOrThrowArgs>(args: SelectSubset<T, PendingRegistrationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingRegistration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationFindFirstArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PendingRegistrationFindFirstArgs>(args?: SelectSubset<T, PendingRegistrationFindFirstArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PendingRegistration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationFindFirstOrThrowArgs} args - Arguments to find a PendingRegistration
     * @example
     * // Get one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PendingRegistrationFindFirstOrThrowArgs>(args?: SelectSubset<T, PendingRegistrationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PendingRegistrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PendingRegistrations
     * const pendingRegistrations = await prisma.pendingRegistration.findMany()
     * 
     * // Get first 10 PendingRegistrations
     * const pendingRegistrations = await prisma.pendingRegistration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pendingRegistrationWithIdOnly = await prisma.pendingRegistration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PendingRegistrationFindManyArgs>(args?: SelectSubset<T, PendingRegistrationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PendingRegistration.
     * @param {PendingRegistrationCreateArgs} args - Arguments to create a PendingRegistration.
     * @example
     * // Create one PendingRegistration
     * const PendingRegistration = await prisma.pendingRegistration.create({
     *   data: {
     *     // ... data to create a PendingRegistration
     *   }
     * })
     * 
     */
    create<T extends PendingRegistrationCreateArgs>(args: SelectSubset<T, PendingRegistrationCreateArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PendingRegistrations.
     * @param {PendingRegistrationCreateManyArgs} args - Arguments to create many PendingRegistrations.
     * @example
     * // Create many PendingRegistrations
     * const pendingRegistration = await prisma.pendingRegistration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PendingRegistrationCreateManyArgs>(args?: SelectSubset<T, PendingRegistrationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PendingRegistration.
     * @param {PendingRegistrationDeleteArgs} args - Arguments to delete one PendingRegistration.
     * @example
     * // Delete one PendingRegistration
     * const PendingRegistration = await prisma.pendingRegistration.delete({
     *   where: {
     *     // ... filter to delete one PendingRegistration
     *   }
     * })
     * 
     */
    delete<T extends PendingRegistrationDeleteArgs>(args: SelectSubset<T, PendingRegistrationDeleteArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PendingRegistration.
     * @param {PendingRegistrationUpdateArgs} args - Arguments to update one PendingRegistration.
     * @example
     * // Update one PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PendingRegistrationUpdateArgs>(args: SelectSubset<T, PendingRegistrationUpdateArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PendingRegistrations.
     * @param {PendingRegistrationDeleteManyArgs} args - Arguments to filter PendingRegistrations to delete.
     * @example
     * // Delete a few PendingRegistrations
     * const { count } = await prisma.pendingRegistration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PendingRegistrationDeleteManyArgs>(args?: SelectSubset<T, PendingRegistrationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PendingRegistrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PendingRegistrations
     * const pendingRegistration = await prisma.pendingRegistration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PendingRegistrationUpdateManyArgs>(args: SelectSubset<T, PendingRegistrationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PendingRegistration.
     * @param {PendingRegistrationUpsertArgs} args - Arguments to update or create a PendingRegistration.
     * @example
     * // Update or create a PendingRegistration
     * const pendingRegistration = await prisma.pendingRegistration.upsert({
     *   create: {
     *     // ... data to create a PendingRegistration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PendingRegistration we want to update
     *   }
     * })
     */
    upsert<T extends PendingRegistrationUpsertArgs>(args: SelectSubset<T, PendingRegistrationUpsertArgs<ExtArgs>>): Prisma__PendingRegistrationClient<$Result.GetResult<Prisma.$PendingRegistrationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PendingRegistrations that matches the filter.
     * @param {PendingRegistrationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const pendingRegistration = await prisma.pendingRegistration.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PendingRegistrationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PendingRegistration.
     * @param {PendingRegistrationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const pendingRegistration = await prisma.pendingRegistration.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PendingRegistrationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PendingRegistrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationCountArgs} args - Arguments to filter PendingRegistrations to count.
     * @example
     * // Count the number of PendingRegistrations
     * const count = await prisma.pendingRegistration.count({
     *   where: {
     *     // ... the filter for the PendingRegistrations we want to count
     *   }
     * })
    **/
    count<T extends PendingRegistrationCountArgs>(
      args?: Subset<T, PendingRegistrationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PendingRegistrationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PendingRegistration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PendingRegistrationAggregateArgs>(args: Subset<T, PendingRegistrationAggregateArgs>): Prisma.PrismaPromise<GetPendingRegistrationAggregateType<T>>

    /**
     * Group by PendingRegistration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PendingRegistrationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PendingRegistrationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PendingRegistrationGroupByArgs['orderBy'] }
        : { orderBy?: PendingRegistrationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PendingRegistrationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPendingRegistrationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PendingRegistration model
   */
  readonly fields: PendingRegistrationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PendingRegistration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PendingRegistrationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PendingRegistration model
   */
  interface PendingRegistrationFieldRefs {
    readonly id: FieldRef<"PendingRegistration", 'String'>
    readonly email: FieldRef<"PendingRegistration", 'String'>
    readonly code: FieldRef<"PendingRegistration", 'String'>
    readonly expiresAt: FieldRef<"PendingRegistration", 'DateTime'>
    readonly passwordHash: FieldRef<"PendingRegistration", 'String'>
    readonly firstName: FieldRef<"PendingRegistration", 'String'>
    readonly lastName: FieldRef<"PendingRegistration", 'String'>
    readonly nin: FieldRef<"PendingRegistration", 'String'>
    readonly picture: FieldRef<"PendingRegistration", 'String'>
    readonly createdAt: FieldRef<"PendingRegistration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PendingRegistration findUnique
   */
  export type PendingRegistrationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration findUniqueOrThrow
   */
  export type PendingRegistrationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration findFirst
   */
  export type PendingRegistrationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingRegistrations.
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingRegistrations.
     */
    distinct?: PendingRegistrationScalarFieldEnum | PendingRegistrationScalarFieldEnum[]
  }

  /**
   * PendingRegistration findFirstOrThrow
   */
  export type PendingRegistrationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Filter, which PendingRegistration to fetch.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PendingRegistrations.
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PendingRegistrations.
     */
    distinct?: PendingRegistrationScalarFieldEnum | PendingRegistrationScalarFieldEnum[]
  }

  /**
   * PendingRegistration findMany
   */
  export type PendingRegistrationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Filter, which PendingRegistrations to fetch.
     */
    where?: PendingRegistrationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PendingRegistrations to fetch.
     */
    orderBy?: PendingRegistrationOrderByWithRelationInput | PendingRegistrationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PendingRegistrations.
     */
    cursor?: PendingRegistrationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PendingRegistrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PendingRegistrations.
     */
    skip?: number
    distinct?: PendingRegistrationScalarFieldEnum | PendingRegistrationScalarFieldEnum[]
  }

  /**
   * PendingRegistration create
   */
  export type PendingRegistrationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * The data needed to create a PendingRegistration.
     */
    data: XOR<PendingRegistrationCreateInput, PendingRegistrationUncheckedCreateInput>
  }

  /**
   * PendingRegistration createMany
   */
  export type PendingRegistrationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PendingRegistrations.
     */
    data: PendingRegistrationCreateManyInput | PendingRegistrationCreateManyInput[]
  }

  /**
   * PendingRegistration update
   */
  export type PendingRegistrationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * The data needed to update a PendingRegistration.
     */
    data: XOR<PendingRegistrationUpdateInput, PendingRegistrationUncheckedUpdateInput>
    /**
     * Choose, which PendingRegistration to update.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration updateMany
   */
  export type PendingRegistrationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PendingRegistrations.
     */
    data: XOR<PendingRegistrationUpdateManyMutationInput, PendingRegistrationUncheckedUpdateManyInput>
    /**
     * Filter which PendingRegistrations to update
     */
    where?: PendingRegistrationWhereInput
    /**
     * Limit how many PendingRegistrations to update.
     */
    limit?: number
  }

  /**
   * PendingRegistration upsert
   */
  export type PendingRegistrationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * The filter to search for the PendingRegistration to update in case it exists.
     */
    where: PendingRegistrationWhereUniqueInput
    /**
     * In case the PendingRegistration found by the `where` argument doesn't exist, create a new PendingRegistration with this data.
     */
    create: XOR<PendingRegistrationCreateInput, PendingRegistrationUncheckedCreateInput>
    /**
     * In case the PendingRegistration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PendingRegistrationUpdateInput, PendingRegistrationUncheckedUpdateInput>
  }

  /**
   * PendingRegistration delete
   */
  export type PendingRegistrationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
    /**
     * Filter which PendingRegistration to delete.
     */
    where: PendingRegistrationWhereUniqueInput
  }

  /**
   * PendingRegistration deleteMany
   */
  export type PendingRegistrationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PendingRegistrations to delete
     */
    where?: PendingRegistrationWhereInput
    /**
     * Limit how many PendingRegistrations to delete.
     */
    limit?: number
  }

  /**
   * PendingRegistration findRaw
   */
  export type PendingRegistrationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PendingRegistration aggregateRaw
   */
  export type PendingRegistrationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PendingRegistration without action
   */
  export type PendingRegistrationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PendingRegistration
     */
    select?: PendingRegistrationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PendingRegistration
     */
    omit?: PendingRegistrationOmit<ExtArgs> | null
  }


  /**
   * Model Wallet
   */

  export type AggregateWallet = {
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  export type WalletAvgAggregateOutputType = {
    balance: number | null
  }

  export type WalletSumAggregateOutputType = {
    balance: number | null
  }

  export type WalletMinAggregateOutputType = {
    id: string | null
    userId: string | null
    balance: number | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    balance: number | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WalletCountAggregateOutputType = {
    id: number
    userId: number
    balance: number
    currency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WalletAvgAggregateInputType = {
    balance?: true
  }

  export type WalletSumAggregateInputType = {
    balance?: true
  }

  export type WalletMinAggregateInputType = {
    id?: true
    userId?: true
    balance?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletMaxAggregateInputType = {
    id?: true
    userId?: true
    balance?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WalletCountAggregateInputType = {
    id?: true
    userId?: true
    balance?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallet to aggregate.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wallets
    **/
    _count?: true | WalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletMaxAggregateInputType
  }

  export type GetWalletAggregateType<T extends WalletAggregateArgs> = {
        [P in keyof T & keyof AggregateWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWallet[P]>
      : GetScalarType<T[P], AggregateWallet[P]>
  }




  export type WalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletWhereInput
    orderBy?: WalletOrderByWithAggregationInput | WalletOrderByWithAggregationInput[]
    by: WalletScalarFieldEnum[] | WalletScalarFieldEnum
    having?: WalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletCountAggregateInputType | true
    _avg?: WalletAvgAggregateInputType
    _sum?: WalletSumAggregateInputType
    _min?: WalletMinAggregateInputType
    _max?: WalletMaxAggregateInputType
  }

  export type WalletGroupByOutputType = {
    id: string
    userId: string
    balance: number
    currency: string
    createdAt: Date
    updatedAt: Date
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  type GetWalletGroupByPayload<T extends WalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletGroupByOutputType[P]>
            : GetScalarType<T[P], WalletGroupByOutputType[P]>
        }
      >
    >


  export type WalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    balance?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["wallet"]>



  export type WalletSelectScalar = {
    id?: boolean
    userId?: boolean
    balance?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "balance" | "currency" | "createdAt" | "updatedAt", ExtArgs["result"]["wallet"]>

  export type $WalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wallet"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      balance: number
      currency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["wallet"]>
    composites: {}
  }

  type WalletGetPayload<S extends boolean | null | undefined | WalletDefaultArgs> = $Result.GetResult<Prisma.$WalletPayload, S>

  type WalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletCountAggregateInputType | true
    }

  export interface WalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wallet'], meta: { name: 'Wallet' } }
    /**
     * Find zero or one Wallet that matches the filter.
     * @param {WalletFindUniqueArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletFindUniqueArgs>(args: SelectSubset<T, WalletFindUniqueArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletFindUniqueOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletFindFirstArgs>(args?: SelectSubset<T, WalletFindFirstArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wallets
     * const wallets = await prisma.wallet.findMany()
     * 
     * // Get first 10 Wallets
     * const wallets = await prisma.wallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletWithIdOnly = await prisma.wallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletFindManyArgs>(args?: SelectSubset<T, WalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wallet.
     * @param {WalletCreateArgs} args - Arguments to create a Wallet.
     * @example
     * // Create one Wallet
     * const Wallet = await prisma.wallet.create({
     *   data: {
     *     // ... data to create a Wallet
     *   }
     * })
     * 
     */
    create<T extends WalletCreateArgs>(args: SelectSubset<T, WalletCreateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wallets.
     * @param {WalletCreateManyArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletCreateManyArgs>(args?: SelectSubset<T, WalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Wallet.
     * @param {WalletDeleteArgs} args - Arguments to delete one Wallet.
     * @example
     * // Delete one Wallet
     * const Wallet = await prisma.wallet.delete({
     *   where: {
     *     // ... filter to delete one Wallet
     *   }
     * })
     * 
     */
    delete<T extends WalletDeleteArgs>(args: SelectSubset<T, WalletDeleteArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wallet.
     * @param {WalletUpdateArgs} args - Arguments to update one Wallet.
     * @example
     * // Update one Wallet
     * const wallet = await prisma.wallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletUpdateArgs>(args: SelectSubset<T, WalletUpdateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wallets.
     * @param {WalletDeleteManyArgs} args - Arguments to filter Wallets to delete.
     * @example
     * // Delete a few Wallets
     * const { count } = await prisma.wallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletDeleteManyArgs>(args?: SelectSubset<T, WalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletUpdateManyArgs>(args: SelectSubset<T, WalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Wallet.
     * @param {WalletUpsertArgs} args - Arguments to update or create a Wallet.
     * @example
     * // Update or create a Wallet
     * const wallet = await prisma.wallet.upsert({
     *   create: {
     *     // ... data to create a Wallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wallet we want to update
     *   }
     * })
     */
    upsert<T extends WalletUpsertArgs>(args: SelectSubset<T, WalletUpsertArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wallets that matches the filter.
     * @param {WalletFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const wallet = await prisma.wallet.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: WalletFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Wallet.
     * @param {WalletAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const wallet = await prisma.wallet.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: WalletAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletCountArgs} args - Arguments to filter Wallets to count.
     * @example
     * // Count the number of Wallets
     * const count = await prisma.wallet.count({
     *   where: {
     *     // ... the filter for the Wallets we want to count
     *   }
     * })
    **/
    count<T extends WalletCountArgs>(
      args?: Subset<T, WalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WalletAggregateArgs>(args: Subset<T, WalletAggregateArgs>): Prisma.PrismaPromise<GetWalletAggregateType<T>>

    /**
     * Group by Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletGroupByArgs['orderBy'] }
        : { orderBy?: WalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wallet model
   */
  readonly fields: WalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wallet model
   */
  interface WalletFieldRefs {
    readonly id: FieldRef<"Wallet", 'String'>
    readonly userId: FieldRef<"Wallet", 'String'>
    readonly balance: FieldRef<"Wallet", 'Float'>
    readonly currency: FieldRef<"Wallet", 'String'>
    readonly createdAt: FieldRef<"Wallet", 'DateTime'>
    readonly updatedAt: FieldRef<"Wallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wallet findUnique
   */
  export type WalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findUniqueOrThrow
   */
  export type WalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findFirst
   */
  export type WalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findFirstOrThrow
   */
  export type WalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findMany
   */
  export type WalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Filter, which Wallets to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet create
   */
  export type WalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data needed to create a Wallet.
     */
    data: XOR<WalletCreateInput, WalletUncheckedCreateInput>
  }

  /**
   * Wallet createMany
   */
  export type WalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
  }

  /**
   * Wallet update
   */
  export type WalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data needed to update a Wallet.
     */
    data: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
    /**
     * Choose, which Wallet to update.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet updateMany
   */
  export type WalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
  }

  /**
   * Wallet upsert
   */
  export type WalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The filter to search for the Wallet to update in case it exists.
     */
    where: WalletWhereUniqueInput
    /**
     * In case the Wallet found by the `where` argument doesn't exist, create a new Wallet with this data.
     */
    create: XOR<WalletCreateInput, WalletUncheckedCreateInput>
    /**
     * In case the Wallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
  }

  /**
   * Wallet delete
   */
  export type WalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Filter which Wallet to delete.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet deleteMany
   */
  export type WalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallets to delete
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to delete.
     */
    limit?: number
  }

  /**
   * Wallet findRaw
   */
  export type WalletFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Wallet aggregateRaw
   */
  export type WalletAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Wallet without action
   */
  export type WalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
  }


  /**
   * Model Loan
   */

  export type AggregateLoan = {
    _count: LoanCountAggregateOutputType | null
    _avg: LoanAvgAggregateOutputType | null
    _sum: LoanSumAggregateOutputType | null
    _min: LoanMinAggregateOutputType | null
    _max: LoanMaxAggregateOutputType | null
  }

  export type LoanAvgAggregateOutputType = {
    amount: number | null
    amountRepaid: number | null
  }

  export type LoanSumAggregateOutputType = {
    amount: number | null
    amountRepaid: number | null
  }

  export type LoanMinAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    purpose: string | null
    status: string | null
    dueDate: Date | null
    disbursedAt: Date | null
    amountRepaid: number | null
    repaidAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoanMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    purpose: string | null
    status: string | null
    dueDate: Date | null
    disbursedAt: Date | null
    amountRepaid: number | null
    repaidAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoanCountAggregateOutputType = {
    id: number
    userId: number
    amount: number
    purpose: number
    status: number
    dueDate: number
    disbursedAt: number
    amountRepaid: number
    repaidAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LoanAvgAggregateInputType = {
    amount?: true
    amountRepaid?: true
  }

  export type LoanSumAggregateInputType = {
    amount?: true
    amountRepaid?: true
  }

  export type LoanMinAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    purpose?: true
    status?: true
    dueDate?: true
    disbursedAt?: true
    amountRepaid?: true
    repaidAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoanMaxAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    purpose?: true
    status?: true
    dueDate?: true
    disbursedAt?: true
    amountRepaid?: true
    repaidAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoanCountAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    purpose?: true
    status?: true
    dueDate?: true
    disbursedAt?: true
    amountRepaid?: true
    repaidAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Loan to aggregate.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Loans
    **/
    _count?: true | LoanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoanMaxAggregateInputType
  }

  export type GetLoanAggregateType<T extends LoanAggregateArgs> = {
        [P in keyof T & keyof AggregateLoan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoan[P]>
      : GetScalarType<T[P], AggregateLoan[P]>
  }




  export type LoanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanWhereInput
    orderBy?: LoanOrderByWithAggregationInput | LoanOrderByWithAggregationInput[]
    by: LoanScalarFieldEnum[] | LoanScalarFieldEnum
    having?: LoanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoanCountAggregateInputType | true
    _avg?: LoanAvgAggregateInputType
    _sum?: LoanSumAggregateInputType
    _min?: LoanMinAggregateInputType
    _max?: LoanMaxAggregateInputType
  }

  export type LoanGroupByOutputType = {
    id: string
    userId: string
    amount: number
    purpose: string | null
    status: string
    dueDate: Date | null
    disbursedAt: Date | null
    amountRepaid: number
    repaidAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: LoanCountAggregateOutputType | null
    _avg: LoanAvgAggregateOutputType | null
    _sum: LoanSumAggregateOutputType | null
    _min: LoanMinAggregateOutputType | null
    _max: LoanMaxAggregateOutputType | null
  }

  type GetLoanGroupByPayload<T extends LoanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoanGroupByOutputType[P]>
            : GetScalarType<T[P], LoanGroupByOutputType[P]>
        }
      >
    >


  export type LoanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    purpose?: boolean
    status?: boolean
    dueDate?: boolean
    disbursedAt?: boolean
    amountRepaid?: boolean
    repaidAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["loan"]>



  export type LoanSelectScalar = {
    id?: boolean
    userId?: boolean
    amount?: boolean
    purpose?: boolean
    status?: boolean
    dueDate?: boolean
    disbursedAt?: boolean
    amountRepaid?: boolean
    repaidAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "amount" | "purpose" | "status" | "dueDate" | "disbursedAt" | "amountRepaid" | "repaidAt" | "createdAt" | "updatedAt", ExtArgs["result"]["loan"]>

  export type $LoanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Loan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      amount: number
      purpose: string | null
      status: string
      dueDate: Date | null
      disbursedAt: Date | null
      amountRepaid: number
      repaidAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["loan"]>
    composites: {}
  }

  type LoanGetPayload<S extends boolean | null | undefined | LoanDefaultArgs> = $Result.GetResult<Prisma.$LoanPayload, S>

  type LoanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoanCountAggregateInputType | true
    }

  export interface LoanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Loan'], meta: { name: 'Loan' } }
    /**
     * Find zero or one Loan that matches the filter.
     * @param {LoanFindUniqueArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoanFindUniqueArgs>(args: SelectSubset<T, LoanFindUniqueArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Loan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoanFindUniqueOrThrowArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoanFindUniqueOrThrowArgs>(args: SelectSubset<T, LoanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Loan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFindFirstArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoanFindFirstArgs>(args?: SelectSubset<T, LoanFindFirstArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Loan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFindFirstOrThrowArgs} args - Arguments to find a Loan
     * @example
     * // Get one Loan
     * const loan = await prisma.loan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoanFindFirstOrThrowArgs>(args?: SelectSubset<T, LoanFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Loans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Loans
     * const loans = await prisma.loan.findMany()
     * 
     * // Get first 10 Loans
     * const loans = await prisma.loan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loanWithIdOnly = await prisma.loan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoanFindManyArgs>(args?: SelectSubset<T, LoanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Loan.
     * @param {LoanCreateArgs} args - Arguments to create a Loan.
     * @example
     * // Create one Loan
     * const Loan = await prisma.loan.create({
     *   data: {
     *     // ... data to create a Loan
     *   }
     * })
     * 
     */
    create<T extends LoanCreateArgs>(args: SelectSubset<T, LoanCreateArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Loans.
     * @param {LoanCreateManyArgs} args - Arguments to create many Loans.
     * @example
     * // Create many Loans
     * const loan = await prisma.loan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoanCreateManyArgs>(args?: SelectSubset<T, LoanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Loan.
     * @param {LoanDeleteArgs} args - Arguments to delete one Loan.
     * @example
     * // Delete one Loan
     * const Loan = await prisma.loan.delete({
     *   where: {
     *     // ... filter to delete one Loan
     *   }
     * })
     * 
     */
    delete<T extends LoanDeleteArgs>(args: SelectSubset<T, LoanDeleteArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Loan.
     * @param {LoanUpdateArgs} args - Arguments to update one Loan.
     * @example
     * // Update one Loan
     * const loan = await prisma.loan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoanUpdateArgs>(args: SelectSubset<T, LoanUpdateArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Loans.
     * @param {LoanDeleteManyArgs} args - Arguments to filter Loans to delete.
     * @example
     * // Delete a few Loans
     * const { count } = await prisma.loan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoanDeleteManyArgs>(args?: SelectSubset<T, LoanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Loans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Loans
     * const loan = await prisma.loan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoanUpdateManyArgs>(args: SelectSubset<T, LoanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Loan.
     * @param {LoanUpsertArgs} args - Arguments to update or create a Loan.
     * @example
     * // Update or create a Loan
     * const loan = await prisma.loan.upsert({
     *   create: {
     *     // ... data to create a Loan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Loan we want to update
     *   }
     * })
     */
    upsert<T extends LoanUpsertArgs>(args: SelectSubset<T, LoanUpsertArgs<ExtArgs>>): Prisma__LoanClient<$Result.GetResult<Prisma.$LoanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Loans that matches the filter.
     * @param {LoanFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const loan = await prisma.loan.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: LoanFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Loan.
     * @param {LoanAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const loan = await prisma.loan.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: LoanAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Loans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanCountArgs} args - Arguments to filter Loans to count.
     * @example
     * // Count the number of Loans
     * const count = await prisma.loan.count({
     *   where: {
     *     // ... the filter for the Loans we want to count
     *   }
     * })
    **/
    count<T extends LoanCountArgs>(
      args?: Subset<T, LoanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Loan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoanAggregateArgs>(args: Subset<T, LoanAggregateArgs>): Prisma.PrismaPromise<GetLoanAggregateType<T>>

    /**
     * Group by Loan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoanGroupByArgs['orderBy'] }
        : { orderBy?: LoanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Loan model
   */
  readonly fields: LoanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Loan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Loan model
   */
  interface LoanFieldRefs {
    readonly id: FieldRef<"Loan", 'String'>
    readonly userId: FieldRef<"Loan", 'String'>
    readonly amount: FieldRef<"Loan", 'Float'>
    readonly purpose: FieldRef<"Loan", 'String'>
    readonly status: FieldRef<"Loan", 'String'>
    readonly dueDate: FieldRef<"Loan", 'DateTime'>
    readonly disbursedAt: FieldRef<"Loan", 'DateTime'>
    readonly amountRepaid: FieldRef<"Loan", 'Float'>
    readonly repaidAt: FieldRef<"Loan", 'DateTime'>
    readonly createdAt: FieldRef<"Loan", 'DateTime'>
    readonly updatedAt: FieldRef<"Loan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Loan findUnique
   */
  export type LoanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan findUniqueOrThrow
   */
  export type LoanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan findFirst
   */
  export type LoanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Loans.
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Loans.
     */
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * Loan findFirstOrThrow
   */
  export type LoanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Filter, which Loan to fetch.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Loans.
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Loans.
     */
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * Loan findMany
   */
  export type LoanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Filter, which Loans to fetch.
     */
    where?: LoanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Loans to fetch.
     */
    orderBy?: LoanOrderByWithRelationInput | LoanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Loans.
     */
    cursor?: LoanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Loans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Loans.
     */
    skip?: number
    distinct?: LoanScalarFieldEnum | LoanScalarFieldEnum[]
  }

  /**
   * Loan create
   */
  export type LoanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * The data needed to create a Loan.
     */
    data: XOR<LoanCreateInput, LoanUncheckedCreateInput>
  }

  /**
   * Loan createMany
   */
  export type LoanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Loans.
     */
    data: LoanCreateManyInput | LoanCreateManyInput[]
  }

  /**
   * Loan update
   */
  export type LoanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * The data needed to update a Loan.
     */
    data: XOR<LoanUpdateInput, LoanUncheckedUpdateInput>
    /**
     * Choose, which Loan to update.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan updateMany
   */
  export type LoanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Loans.
     */
    data: XOR<LoanUpdateManyMutationInput, LoanUncheckedUpdateManyInput>
    /**
     * Filter which Loans to update
     */
    where?: LoanWhereInput
    /**
     * Limit how many Loans to update.
     */
    limit?: number
  }

  /**
   * Loan upsert
   */
  export type LoanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * The filter to search for the Loan to update in case it exists.
     */
    where: LoanWhereUniqueInput
    /**
     * In case the Loan found by the `where` argument doesn't exist, create a new Loan with this data.
     */
    create: XOR<LoanCreateInput, LoanUncheckedCreateInput>
    /**
     * In case the Loan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoanUpdateInput, LoanUncheckedUpdateInput>
  }

  /**
   * Loan delete
   */
  export type LoanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
    /**
     * Filter which Loan to delete.
     */
    where: LoanWhereUniqueInput
  }

  /**
   * Loan deleteMany
   */
  export type LoanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Loans to delete
     */
    where?: LoanWhereInput
    /**
     * Limit how many Loans to delete.
     */
    limit?: number
  }

  /**
   * Loan findRaw
   */
  export type LoanFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Loan aggregateRaw
   */
  export type LoanAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Loan without action
   */
  export type LoanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Loan
     */
    select?: LoanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Loan
     */
    omit?: LoanOmit<ExtArgs> | null
  }


  /**
   * Model Provider
   */

  export type AggregateProvider = {
    _count: ProviderCountAggregateOutputType | null
    _avg: ProviderAvgAggregateOutputType | null
    _sum: ProviderSumAggregateOutputType | null
    _min: ProviderMinAggregateOutputType | null
    _max: ProviderMaxAggregateOutputType | null
  }

  export type ProviderAvgAggregateOutputType = {
    agreedAmount: number | null
    percentageToAdd: number | null
  }

  export type ProviderSumAggregateOutputType = {
    agreedAmount: number | null
    percentageToAdd: number | null
  }

  export type ProviderMinAggregateOutputType = {
    id: string | null
    providerNumber: string | null
    name: string | null
    email: string | null
    agreedAmount: number | null
    percentageToAdd: number | null
    agreedAt: Date | null
    agreedTerms: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderMaxAggregateOutputType = {
    id: string | null
    providerNumber: string | null
    name: string | null
    email: string | null
    agreedAmount: number | null
    percentageToAdd: number | null
    agreedAt: Date | null
    agreedTerms: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderCountAggregateOutputType = {
    id: number
    providerNumber: number
    name: number
    email: number
    agreedAmount: number
    percentageToAdd: number
    agreedAt: number
    agreedTerms: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProviderAvgAggregateInputType = {
    agreedAmount?: true
    percentageToAdd?: true
  }

  export type ProviderSumAggregateInputType = {
    agreedAmount?: true
    percentageToAdd?: true
  }

  export type ProviderMinAggregateInputType = {
    id?: true
    providerNumber?: true
    name?: true
    email?: true
    agreedAmount?: true
    percentageToAdd?: true
    agreedAt?: true
    agreedTerms?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderMaxAggregateInputType = {
    id?: true
    providerNumber?: true
    name?: true
    email?: true
    agreedAmount?: true
    percentageToAdd?: true
    agreedAt?: true
    agreedTerms?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderCountAggregateInputType = {
    id?: true
    providerNumber?: true
    name?: true
    email?: true
    agreedAmount?: true
    percentageToAdd?: true
    agreedAt?: true
    agreedTerms?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Provider to aggregate.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Providers
    **/
    _count?: true | ProviderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProviderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProviderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderMaxAggregateInputType
  }

  export type GetProviderAggregateType<T extends ProviderAggregateArgs> = {
        [P in keyof T & keyof AggregateProvider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProvider[P]>
      : GetScalarType<T[P], AggregateProvider[P]>
  }




  export type ProviderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderWhereInput
    orderBy?: ProviderOrderByWithAggregationInput | ProviderOrderByWithAggregationInput[]
    by: ProviderScalarFieldEnum[] | ProviderScalarFieldEnum
    having?: ProviderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderCountAggregateInputType | true
    _avg?: ProviderAvgAggregateInputType
    _sum?: ProviderSumAggregateInputType
    _min?: ProviderMinAggregateInputType
    _max?: ProviderMaxAggregateInputType
  }

  export type ProviderGroupByOutputType = {
    id: string
    providerNumber: string
    name: string
    email: string | null
    agreedAmount: number | null
    percentageToAdd: number
    agreedAt: Date | null
    agreedTerms: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProviderCountAggregateOutputType | null
    _avg: ProviderAvgAggregateOutputType | null
    _sum: ProviderSumAggregateOutputType | null
    _min: ProviderMinAggregateOutputType | null
    _max: ProviderMaxAggregateOutputType | null
  }

  type GetProviderGroupByPayload<T extends ProviderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderGroupByOutputType[P]>
        }
      >
    >


  export type ProviderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerNumber?: boolean
    name?: boolean
    email?: boolean
    agreedAmount?: boolean
    percentageToAdd?: boolean
    agreedAt?: boolean
    agreedTerms?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loanFundings?: boolean | Provider$loanFundingsArgs<ExtArgs>
    _count?: boolean | ProviderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["provider"]>



  export type ProviderSelectScalar = {
    id?: boolean
    providerNumber?: boolean
    name?: boolean
    email?: boolean
    agreedAmount?: boolean
    percentageToAdd?: boolean
    agreedAt?: boolean
    agreedTerms?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProviderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "providerNumber" | "name" | "email" | "agreedAmount" | "percentageToAdd" | "agreedAt" | "agreedTerms" | "createdAt" | "updatedAt", ExtArgs["result"]["provider"]>
  export type ProviderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loanFundings?: boolean | Provider$loanFundingsArgs<ExtArgs>
    _count?: boolean | ProviderCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProviderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Provider"
    objects: {
      loanFundings: Prisma.$LoanFundingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      providerNumber: string
      name: string
      email: string | null
      agreedAmount: number | null
      percentageToAdd: number
      agreedAt: Date | null
      agreedTerms: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["provider"]>
    composites: {}
  }

  type ProviderGetPayload<S extends boolean | null | undefined | ProviderDefaultArgs> = $Result.GetResult<Prisma.$ProviderPayload, S>

  type ProviderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProviderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProviderCountAggregateInputType | true
    }

  export interface ProviderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Provider'], meta: { name: 'Provider' } }
    /**
     * Find zero or one Provider that matches the filter.
     * @param {ProviderFindUniqueArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderFindUniqueArgs>(args: SelectSubset<T, ProviderFindUniqueArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Provider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProviderFindUniqueOrThrowArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Provider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderFindFirstArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderFindFirstArgs>(args?: SelectSubset<T, ProviderFindFirstArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Provider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderFindFirstOrThrowArgs} args - Arguments to find a Provider
     * @example
     * // Get one Provider
     * const provider = await prisma.provider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Providers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Providers
     * const providers = await prisma.provider.findMany()
     * 
     * // Get first 10 Providers
     * const providers = await prisma.provider.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerWithIdOnly = await prisma.provider.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderFindManyArgs>(args?: SelectSubset<T, ProviderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Provider.
     * @param {ProviderCreateArgs} args - Arguments to create a Provider.
     * @example
     * // Create one Provider
     * const Provider = await prisma.provider.create({
     *   data: {
     *     // ... data to create a Provider
     *   }
     * })
     * 
     */
    create<T extends ProviderCreateArgs>(args: SelectSubset<T, ProviderCreateArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Providers.
     * @param {ProviderCreateManyArgs} args - Arguments to create many Providers.
     * @example
     * // Create many Providers
     * const provider = await prisma.provider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderCreateManyArgs>(args?: SelectSubset<T, ProviderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Provider.
     * @param {ProviderDeleteArgs} args - Arguments to delete one Provider.
     * @example
     * // Delete one Provider
     * const Provider = await prisma.provider.delete({
     *   where: {
     *     // ... filter to delete one Provider
     *   }
     * })
     * 
     */
    delete<T extends ProviderDeleteArgs>(args: SelectSubset<T, ProviderDeleteArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Provider.
     * @param {ProviderUpdateArgs} args - Arguments to update one Provider.
     * @example
     * // Update one Provider
     * const provider = await prisma.provider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderUpdateArgs>(args: SelectSubset<T, ProviderUpdateArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Providers.
     * @param {ProviderDeleteManyArgs} args - Arguments to filter Providers to delete.
     * @example
     * // Delete a few Providers
     * const { count } = await prisma.provider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderDeleteManyArgs>(args?: SelectSubset<T, ProviderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Providers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Providers
     * const provider = await prisma.provider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderUpdateManyArgs>(args: SelectSubset<T, ProviderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Provider.
     * @param {ProviderUpsertArgs} args - Arguments to update or create a Provider.
     * @example
     * // Update or create a Provider
     * const provider = await prisma.provider.upsert({
     *   create: {
     *     // ... data to create a Provider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Provider we want to update
     *   }
     * })
     */
    upsert<T extends ProviderUpsertArgs>(args: SelectSubset<T, ProviderUpsertArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Providers that matches the filter.
     * @param {ProviderFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const provider = await prisma.provider.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ProviderFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Provider.
     * @param {ProviderAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const provider = await prisma.provider.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ProviderAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Providers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCountArgs} args - Arguments to filter Providers to count.
     * @example
     * // Count the number of Providers
     * const count = await prisma.provider.count({
     *   where: {
     *     // ... the filter for the Providers we want to count
     *   }
     * })
    **/
    count<T extends ProviderCountArgs>(
      args?: Subset<T, ProviderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Provider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProviderAggregateArgs>(args: Subset<T, ProviderAggregateArgs>): Prisma.PrismaPromise<GetProviderAggregateType<T>>

    /**
     * Group by Provider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProviderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderGroupByArgs['orderBy'] }
        : { orderBy?: ProviderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProviderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Provider model
   */
  readonly fields: ProviderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Provider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loanFundings<T extends Provider$loanFundingsArgs<ExtArgs> = {}>(args?: Subset<T, Provider$loanFundingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Provider model
   */
  interface ProviderFieldRefs {
    readonly id: FieldRef<"Provider", 'String'>
    readonly providerNumber: FieldRef<"Provider", 'String'>
    readonly name: FieldRef<"Provider", 'String'>
    readonly email: FieldRef<"Provider", 'String'>
    readonly agreedAmount: FieldRef<"Provider", 'Float'>
    readonly percentageToAdd: FieldRef<"Provider", 'Float'>
    readonly agreedAt: FieldRef<"Provider", 'DateTime'>
    readonly agreedTerms: FieldRef<"Provider", 'String'>
    readonly createdAt: FieldRef<"Provider", 'DateTime'>
    readonly updatedAt: FieldRef<"Provider", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Provider findUnique
   */
  export type ProviderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider findUniqueOrThrow
   */
  export type ProviderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider findFirst
   */
  export type ProviderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Providers.
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Providers.
     */
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * Provider findFirstOrThrow
   */
  export type ProviderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Provider to fetch.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Providers.
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Providers.
     */
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * Provider findMany
   */
  export type ProviderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter, which Providers to fetch.
     */
    where?: ProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Providers to fetch.
     */
    orderBy?: ProviderOrderByWithRelationInput | ProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Providers.
     */
    cursor?: ProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Providers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Providers.
     */
    skip?: number
    distinct?: ProviderScalarFieldEnum | ProviderScalarFieldEnum[]
  }

  /**
   * Provider create
   */
  export type ProviderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * The data needed to create a Provider.
     */
    data: XOR<ProviderCreateInput, ProviderUncheckedCreateInput>
  }

  /**
   * Provider createMany
   */
  export type ProviderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Providers.
     */
    data: ProviderCreateManyInput | ProviderCreateManyInput[]
  }

  /**
   * Provider update
   */
  export type ProviderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * The data needed to update a Provider.
     */
    data: XOR<ProviderUpdateInput, ProviderUncheckedUpdateInput>
    /**
     * Choose, which Provider to update.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider updateMany
   */
  export type ProviderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Providers.
     */
    data: XOR<ProviderUpdateManyMutationInput, ProviderUncheckedUpdateManyInput>
    /**
     * Filter which Providers to update
     */
    where?: ProviderWhereInput
    /**
     * Limit how many Providers to update.
     */
    limit?: number
  }

  /**
   * Provider upsert
   */
  export type ProviderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * The filter to search for the Provider to update in case it exists.
     */
    where: ProviderWhereUniqueInput
    /**
     * In case the Provider found by the `where` argument doesn't exist, create a new Provider with this data.
     */
    create: XOR<ProviderCreateInput, ProviderUncheckedCreateInput>
    /**
     * In case the Provider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderUpdateInput, ProviderUncheckedUpdateInput>
  }

  /**
   * Provider delete
   */
  export type ProviderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
    /**
     * Filter which Provider to delete.
     */
    where: ProviderWhereUniqueInput
  }

  /**
   * Provider deleteMany
   */
  export type ProviderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Providers to delete
     */
    where?: ProviderWhereInput
    /**
     * Limit how many Providers to delete.
     */
    limit?: number
  }

  /**
   * Provider findRaw
   */
  export type ProviderFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Provider aggregateRaw
   */
  export type ProviderAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Provider.loanFundings
   */
  export type Provider$loanFundingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    where?: LoanFundingWhereInput
    orderBy?: LoanFundingOrderByWithRelationInput | LoanFundingOrderByWithRelationInput[]
    cursor?: LoanFundingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoanFundingScalarFieldEnum | LoanFundingScalarFieldEnum[]
  }

  /**
   * Provider without action
   */
  export type ProviderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Provider
     */
    select?: ProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Provider
     */
    omit?: ProviderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProviderInclude<ExtArgs> | null
  }


  /**
   * Model ProviderWallet
   */

  export type AggregateProviderWallet = {
    _count: ProviderWalletCountAggregateOutputType | null
    _avg: ProviderWalletAvgAggregateOutputType | null
    _sum: ProviderWalletSumAggregateOutputType | null
    _min: ProviderWalletMinAggregateOutputType | null
    _max: ProviderWalletMaxAggregateOutputType | null
  }

  export type ProviderWalletAvgAggregateOutputType = {
    balance: number | null
    totalFunded: number | null
  }

  export type ProviderWalletSumAggregateOutputType = {
    balance: number | null
    totalFunded: number | null
  }

  export type ProviderWalletMinAggregateOutputType = {
    id: string | null
    providerId: string | null
    balance: number | null
    totalFunded: number | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderWalletMaxAggregateOutputType = {
    id: string | null
    providerId: string | null
    balance: number | null
    totalFunded: number | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProviderWalletCountAggregateOutputType = {
    id: number
    providerId: number
    balance: number
    totalFunded: number
    currency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProviderWalletAvgAggregateInputType = {
    balance?: true
    totalFunded?: true
  }

  export type ProviderWalletSumAggregateInputType = {
    balance?: true
    totalFunded?: true
  }

  export type ProviderWalletMinAggregateInputType = {
    id?: true
    providerId?: true
    balance?: true
    totalFunded?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderWalletMaxAggregateInputType = {
    id?: true
    providerId?: true
    balance?: true
    totalFunded?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProviderWalletCountAggregateInputType = {
    id?: true
    providerId?: true
    balance?: true
    totalFunded?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProviderWalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderWallet to aggregate.
     */
    where?: ProviderWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderWallets to fetch.
     */
    orderBy?: ProviderWalletOrderByWithRelationInput | ProviderWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProviderWallets
    **/
    _count?: true | ProviderWalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProviderWalletAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProviderWalletSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderWalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderWalletMaxAggregateInputType
  }

  export type GetProviderWalletAggregateType<T extends ProviderWalletAggregateArgs> = {
        [P in keyof T & keyof AggregateProviderWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderWallet[P]>
      : GetScalarType<T[P], AggregateProviderWallet[P]>
  }




  export type ProviderWalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderWalletWhereInput
    orderBy?: ProviderWalletOrderByWithAggregationInput | ProviderWalletOrderByWithAggregationInput[]
    by: ProviderWalletScalarFieldEnum[] | ProviderWalletScalarFieldEnum
    having?: ProviderWalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderWalletCountAggregateInputType | true
    _avg?: ProviderWalletAvgAggregateInputType
    _sum?: ProviderWalletSumAggregateInputType
    _min?: ProviderWalletMinAggregateInputType
    _max?: ProviderWalletMaxAggregateInputType
  }

  export type ProviderWalletGroupByOutputType = {
    id: string
    providerId: string
    balance: number
    totalFunded: number
    currency: string
    createdAt: Date
    updatedAt: Date
    _count: ProviderWalletCountAggregateOutputType | null
    _avg: ProviderWalletAvgAggregateOutputType | null
    _sum: ProviderWalletSumAggregateOutputType | null
    _min: ProviderWalletMinAggregateOutputType | null
    _max: ProviderWalletMaxAggregateOutputType | null
  }

  type GetProviderWalletGroupByPayload<T extends ProviderWalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderWalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderWalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderWalletGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderWalletGroupByOutputType[P]>
        }
      >
    >


  export type ProviderWalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    balance?: boolean
    totalFunded?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["providerWallet"]>



  export type ProviderWalletSelectScalar = {
    id?: boolean
    providerId?: boolean
    balance?: boolean
    totalFunded?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProviderWalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "providerId" | "balance" | "totalFunded" | "currency" | "createdAt" | "updatedAt", ExtArgs["result"]["providerWallet"]>

  export type $ProviderWalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProviderWallet"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      providerId: string
      balance: number
      totalFunded: number
      currency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["providerWallet"]>
    composites: {}
  }

  type ProviderWalletGetPayload<S extends boolean | null | undefined | ProviderWalletDefaultArgs> = $Result.GetResult<Prisma.$ProviderWalletPayload, S>

  type ProviderWalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProviderWalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProviderWalletCountAggregateInputType | true
    }

  export interface ProviderWalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProviderWallet'], meta: { name: 'ProviderWallet' } }
    /**
     * Find zero or one ProviderWallet that matches the filter.
     * @param {ProviderWalletFindUniqueArgs} args - Arguments to find a ProviderWallet
     * @example
     * // Get one ProviderWallet
     * const providerWallet = await prisma.providerWallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderWalletFindUniqueArgs>(args: SelectSubset<T, ProviderWalletFindUniqueArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProviderWallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProviderWalletFindUniqueOrThrowArgs} args - Arguments to find a ProviderWallet
     * @example
     * // Get one ProviderWallet
     * const providerWallet = await prisma.providerWallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderWalletFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderWalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProviderWallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletFindFirstArgs} args - Arguments to find a ProviderWallet
     * @example
     * // Get one ProviderWallet
     * const providerWallet = await prisma.providerWallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderWalletFindFirstArgs>(args?: SelectSubset<T, ProviderWalletFindFirstArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProviderWallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletFindFirstOrThrowArgs} args - Arguments to find a ProviderWallet
     * @example
     * // Get one ProviderWallet
     * const providerWallet = await prisma.providerWallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderWalletFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderWalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProviderWallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProviderWallets
     * const providerWallets = await prisma.providerWallet.findMany()
     * 
     * // Get first 10 ProviderWallets
     * const providerWallets = await prisma.providerWallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerWalletWithIdOnly = await prisma.providerWallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderWalletFindManyArgs>(args?: SelectSubset<T, ProviderWalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProviderWallet.
     * @param {ProviderWalletCreateArgs} args - Arguments to create a ProviderWallet.
     * @example
     * // Create one ProviderWallet
     * const ProviderWallet = await prisma.providerWallet.create({
     *   data: {
     *     // ... data to create a ProviderWallet
     *   }
     * })
     * 
     */
    create<T extends ProviderWalletCreateArgs>(args: SelectSubset<T, ProviderWalletCreateArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProviderWallets.
     * @param {ProviderWalletCreateManyArgs} args - Arguments to create many ProviderWallets.
     * @example
     * // Create many ProviderWallets
     * const providerWallet = await prisma.providerWallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderWalletCreateManyArgs>(args?: SelectSubset<T, ProviderWalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProviderWallet.
     * @param {ProviderWalletDeleteArgs} args - Arguments to delete one ProviderWallet.
     * @example
     * // Delete one ProviderWallet
     * const ProviderWallet = await prisma.providerWallet.delete({
     *   where: {
     *     // ... filter to delete one ProviderWallet
     *   }
     * })
     * 
     */
    delete<T extends ProviderWalletDeleteArgs>(args: SelectSubset<T, ProviderWalletDeleteArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProviderWallet.
     * @param {ProviderWalletUpdateArgs} args - Arguments to update one ProviderWallet.
     * @example
     * // Update one ProviderWallet
     * const providerWallet = await prisma.providerWallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderWalletUpdateArgs>(args: SelectSubset<T, ProviderWalletUpdateArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProviderWallets.
     * @param {ProviderWalletDeleteManyArgs} args - Arguments to filter ProviderWallets to delete.
     * @example
     * // Delete a few ProviderWallets
     * const { count } = await prisma.providerWallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderWalletDeleteManyArgs>(args?: SelectSubset<T, ProviderWalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProviderWallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProviderWallets
     * const providerWallet = await prisma.providerWallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderWalletUpdateManyArgs>(args: SelectSubset<T, ProviderWalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProviderWallet.
     * @param {ProviderWalletUpsertArgs} args - Arguments to update or create a ProviderWallet.
     * @example
     * // Update or create a ProviderWallet
     * const providerWallet = await prisma.providerWallet.upsert({
     *   create: {
     *     // ... data to create a ProviderWallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProviderWallet we want to update
     *   }
     * })
     */
    upsert<T extends ProviderWalletUpsertArgs>(args: SelectSubset<T, ProviderWalletUpsertArgs<ExtArgs>>): Prisma__ProviderWalletClient<$Result.GetResult<Prisma.$ProviderWalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProviderWallets that matches the filter.
     * @param {ProviderWalletFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const providerWallet = await prisma.providerWallet.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ProviderWalletFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ProviderWallet.
     * @param {ProviderWalletAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const providerWallet = await prisma.providerWallet.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ProviderWalletAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of ProviderWallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletCountArgs} args - Arguments to filter ProviderWallets to count.
     * @example
     * // Count the number of ProviderWallets
     * const count = await prisma.providerWallet.count({
     *   where: {
     *     // ... the filter for the ProviderWallets we want to count
     *   }
     * })
    **/
    count<T extends ProviderWalletCountArgs>(
      args?: Subset<T, ProviderWalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderWalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProviderWallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProviderWalletAggregateArgs>(args: Subset<T, ProviderWalletAggregateArgs>): Prisma.PrismaPromise<GetProviderWalletAggregateType<T>>

    /**
     * Group by ProviderWallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderWalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProviderWalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderWalletGroupByArgs['orderBy'] }
        : { orderBy?: ProviderWalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProviderWalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProviderWallet model
   */
  readonly fields: ProviderWalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderWallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderWalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProviderWallet model
   */
  interface ProviderWalletFieldRefs {
    readonly id: FieldRef<"ProviderWallet", 'String'>
    readonly providerId: FieldRef<"ProviderWallet", 'String'>
    readonly balance: FieldRef<"ProviderWallet", 'Float'>
    readonly totalFunded: FieldRef<"ProviderWallet", 'Float'>
    readonly currency: FieldRef<"ProviderWallet", 'String'>
    readonly createdAt: FieldRef<"ProviderWallet", 'DateTime'>
    readonly updatedAt: FieldRef<"ProviderWallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProviderWallet findUnique
   */
  export type ProviderWalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * Filter, which ProviderWallet to fetch.
     */
    where: ProviderWalletWhereUniqueInput
  }

  /**
   * ProviderWallet findUniqueOrThrow
   */
  export type ProviderWalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * Filter, which ProviderWallet to fetch.
     */
    where: ProviderWalletWhereUniqueInput
  }

  /**
   * ProviderWallet findFirst
   */
  export type ProviderWalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * Filter, which ProviderWallet to fetch.
     */
    where?: ProviderWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderWallets to fetch.
     */
    orderBy?: ProviderWalletOrderByWithRelationInput | ProviderWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderWallets.
     */
    cursor?: ProviderWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderWallets.
     */
    distinct?: ProviderWalletScalarFieldEnum | ProviderWalletScalarFieldEnum[]
  }

  /**
   * ProviderWallet findFirstOrThrow
   */
  export type ProviderWalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * Filter, which ProviderWallet to fetch.
     */
    where?: ProviderWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderWallets to fetch.
     */
    orderBy?: ProviderWalletOrderByWithRelationInput | ProviderWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderWallets.
     */
    cursor?: ProviderWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderWallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderWallets.
     */
    distinct?: ProviderWalletScalarFieldEnum | ProviderWalletScalarFieldEnum[]
  }

  /**
   * ProviderWallet findMany
   */
  export type ProviderWalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * Filter, which ProviderWallets to fetch.
     */
    where?: ProviderWalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderWallets to fetch.
     */
    orderBy?: ProviderWalletOrderByWithRelationInput | ProviderWalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProviderWallets.
     */
    cursor?: ProviderWalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderWallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderWallets.
     */
    skip?: number
    distinct?: ProviderWalletScalarFieldEnum | ProviderWalletScalarFieldEnum[]
  }

  /**
   * ProviderWallet create
   */
  export type ProviderWalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * The data needed to create a ProviderWallet.
     */
    data: XOR<ProviderWalletCreateInput, ProviderWalletUncheckedCreateInput>
  }

  /**
   * ProviderWallet createMany
   */
  export type ProviderWalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProviderWallets.
     */
    data: ProviderWalletCreateManyInput | ProviderWalletCreateManyInput[]
  }

  /**
   * ProviderWallet update
   */
  export type ProviderWalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * The data needed to update a ProviderWallet.
     */
    data: XOR<ProviderWalletUpdateInput, ProviderWalletUncheckedUpdateInput>
    /**
     * Choose, which ProviderWallet to update.
     */
    where: ProviderWalletWhereUniqueInput
  }

  /**
   * ProviderWallet updateMany
   */
  export type ProviderWalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProviderWallets.
     */
    data: XOR<ProviderWalletUpdateManyMutationInput, ProviderWalletUncheckedUpdateManyInput>
    /**
     * Filter which ProviderWallets to update
     */
    where?: ProviderWalletWhereInput
    /**
     * Limit how many ProviderWallets to update.
     */
    limit?: number
  }

  /**
   * ProviderWallet upsert
   */
  export type ProviderWalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * The filter to search for the ProviderWallet to update in case it exists.
     */
    where: ProviderWalletWhereUniqueInput
    /**
     * In case the ProviderWallet found by the `where` argument doesn't exist, create a new ProviderWallet with this data.
     */
    create: XOR<ProviderWalletCreateInput, ProviderWalletUncheckedCreateInput>
    /**
     * In case the ProviderWallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderWalletUpdateInput, ProviderWalletUncheckedUpdateInput>
  }

  /**
   * ProviderWallet delete
   */
  export type ProviderWalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
    /**
     * Filter which ProviderWallet to delete.
     */
    where: ProviderWalletWhereUniqueInput
  }

  /**
   * ProviderWallet deleteMany
   */
  export type ProviderWalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderWallets to delete
     */
    where?: ProviderWalletWhereInput
    /**
     * Limit how many ProviderWallets to delete.
     */
    limit?: number
  }

  /**
   * ProviderWallet findRaw
   */
  export type ProviderWalletFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ProviderWallet aggregateRaw
   */
  export type ProviderWalletAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ProviderWallet without action
   */
  export type ProviderWalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderWallet
     */
    select?: ProviderWalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderWallet
     */
    omit?: ProviderWalletOmit<ExtArgs> | null
  }


  /**
   * Model LoanFunding
   */

  export type AggregateLoanFunding = {
    _count: LoanFundingCountAggregateOutputType | null
    _avg: LoanFundingAvgAggregateOutputType | null
    _sum: LoanFundingSumAggregateOutputType | null
    _min: LoanFundingMinAggregateOutputType | null
    _max: LoanFundingMaxAggregateOutputType | null
  }

  export type LoanFundingAvgAggregateOutputType = {
    amount: number | null
  }

  export type LoanFundingSumAggregateOutputType = {
    amount: number | null
  }

  export type LoanFundingMinAggregateOutputType = {
    id: string | null
    providerId: string | null
    loanId: string | null
    amount: number | null
    createdAt: Date | null
  }

  export type LoanFundingMaxAggregateOutputType = {
    id: string | null
    providerId: string | null
    loanId: string | null
    amount: number | null
    createdAt: Date | null
  }

  export type LoanFundingCountAggregateOutputType = {
    id: number
    providerId: number
    loanId: number
    amount: number
    createdAt: number
    _all: number
  }


  export type LoanFundingAvgAggregateInputType = {
    amount?: true
  }

  export type LoanFundingSumAggregateInputType = {
    amount?: true
  }

  export type LoanFundingMinAggregateInputType = {
    id?: true
    providerId?: true
    loanId?: true
    amount?: true
    createdAt?: true
  }

  export type LoanFundingMaxAggregateInputType = {
    id?: true
    providerId?: true
    loanId?: true
    amount?: true
    createdAt?: true
  }

  export type LoanFundingCountAggregateInputType = {
    id?: true
    providerId?: true
    loanId?: true
    amount?: true
    createdAt?: true
    _all?: true
  }

  export type LoanFundingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanFunding to aggregate.
     */
    where?: LoanFundingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFundings to fetch.
     */
    orderBy?: LoanFundingOrderByWithRelationInput | LoanFundingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoanFundingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFundings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFundings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoanFundings
    **/
    _count?: true | LoanFundingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoanFundingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoanFundingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoanFundingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoanFundingMaxAggregateInputType
  }

  export type GetLoanFundingAggregateType<T extends LoanFundingAggregateArgs> = {
        [P in keyof T & keyof AggregateLoanFunding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoanFunding[P]>
      : GetScalarType<T[P], AggregateLoanFunding[P]>
  }




  export type LoanFundingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoanFundingWhereInput
    orderBy?: LoanFundingOrderByWithAggregationInput | LoanFundingOrderByWithAggregationInput[]
    by: LoanFundingScalarFieldEnum[] | LoanFundingScalarFieldEnum
    having?: LoanFundingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoanFundingCountAggregateInputType | true
    _avg?: LoanFundingAvgAggregateInputType
    _sum?: LoanFundingSumAggregateInputType
    _min?: LoanFundingMinAggregateInputType
    _max?: LoanFundingMaxAggregateInputType
  }

  export type LoanFundingGroupByOutputType = {
    id: string
    providerId: string
    loanId: string
    amount: number
    createdAt: Date
    _count: LoanFundingCountAggregateOutputType | null
    _avg: LoanFundingAvgAggregateOutputType | null
    _sum: LoanFundingSumAggregateOutputType | null
    _min: LoanFundingMinAggregateOutputType | null
    _max: LoanFundingMaxAggregateOutputType | null
  }

  type GetLoanFundingGroupByPayload<T extends LoanFundingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoanFundingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoanFundingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoanFundingGroupByOutputType[P]>
            : GetScalarType<T[P], LoanFundingGroupByOutputType[P]>
        }
      >
    >


  export type LoanFundingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    loanId?: boolean
    amount?: boolean
    createdAt?: boolean
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loanFunding"]>



  export type LoanFundingSelectScalar = {
    id?: boolean
    providerId?: boolean
    loanId?: boolean
    amount?: boolean
    createdAt?: boolean
  }

  export type LoanFundingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "providerId" | "loanId" | "amount" | "createdAt", ExtArgs["result"]["loanFunding"]>
  export type LoanFundingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    provider?: boolean | ProviderDefaultArgs<ExtArgs>
  }

  export type $LoanFundingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoanFunding"
    objects: {
      provider: Prisma.$ProviderPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      providerId: string
      loanId: string
      amount: number
      createdAt: Date
    }, ExtArgs["result"]["loanFunding"]>
    composites: {}
  }

  type LoanFundingGetPayload<S extends boolean | null | undefined | LoanFundingDefaultArgs> = $Result.GetResult<Prisma.$LoanFundingPayload, S>

  type LoanFundingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoanFundingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoanFundingCountAggregateInputType | true
    }

  export interface LoanFundingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoanFunding'], meta: { name: 'LoanFunding' } }
    /**
     * Find zero or one LoanFunding that matches the filter.
     * @param {LoanFundingFindUniqueArgs} args - Arguments to find a LoanFunding
     * @example
     * // Get one LoanFunding
     * const loanFunding = await prisma.loanFunding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoanFundingFindUniqueArgs>(args: SelectSubset<T, LoanFundingFindUniqueArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoanFunding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoanFundingFindUniqueOrThrowArgs} args - Arguments to find a LoanFunding
     * @example
     * // Get one LoanFunding
     * const loanFunding = await prisma.loanFunding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoanFundingFindUniqueOrThrowArgs>(args: SelectSubset<T, LoanFundingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanFunding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingFindFirstArgs} args - Arguments to find a LoanFunding
     * @example
     * // Get one LoanFunding
     * const loanFunding = await prisma.loanFunding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoanFundingFindFirstArgs>(args?: SelectSubset<T, LoanFundingFindFirstArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoanFunding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingFindFirstOrThrowArgs} args - Arguments to find a LoanFunding
     * @example
     * // Get one LoanFunding
     * const loanFunding = await prisma.loanFunding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoanFundingFindFirstOrThrowArgs>(args?: SelectSubset<T, LoanFundingFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoanFundings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoanFundings
     * const loanFundings = await prisma.loanFunding.findMany()
     * 
     * // Get first 10 LoanFundings
     * const loanFundings = await prisma.loanFunding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loanFundingWithIdOnly = await prisma.loanFunding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoanFundingFindManyArgs>(args?: SelectSubset<T, LoanFundingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoanFunding.
     * @param {LoanFundingCreateArgs} args - Arguments to create a LoanFunding.
     * @example
     * // Create one LoanFunding
     * const LoanFunding = await prisma.loanFunding.create({
     *   data: {
     *     // ... data to create a LoanFunding
     *   }
     * })
     * 
     */
    create<T extends LoanFundingCreateArgs>(args: SelectSubset<T, LoanFundingCreateArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoanFundings.
     * @param {LoanFundingCreateManyArgs} args - Arguments to create many LoanFundings.
     * @example
     * // Create many LoanFundings
     * const loanFunding = await prisma.loanFunding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoanFundingCreateManyArgs>(args?: SelectSubset<T, LoanFundingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LoanFunding.
     * @param {LoanFundingDeleteArgs} args - Arguments to delete one LoanFunding.
     * @example
     * // Delete one LoanFunding
     * const LoanFunding = await prisma.loanFunding.delete({
     *   where: {
     *     // ... filter to delete one LoanFunding
     *   }
     * })
     * 
     */
    delete<T extends LoanFundingDeleteArgs>(args: SelectSubset<T, LoanFundingDeleteArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoanFunding.
     * @param {LoanFundingUpdateArgs} args - Arguments to update one LoanFunding.
     * @example
     * // Update one LoanFunding
     * const loanFunding = await prisma.loanFunding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoanFundingUpdateArgs>(args: SelectSubset<T, LoanFundingUpdateArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoanFundings.
     * @param {LoanFundingDeleteManyArgs} args - Arguments to filter LoanFundings to delete.
     * @example
     * // Delete a few LoanFundings
     * const { count } = await prisma.loanFunding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoanFundingDeleteManyArgs>(args?: SelectSubset<T, LoanFundingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoanFundings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoanFundings
     * const loanFunding = await prisma.loanFunding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoanFundingUpdateManyArgs>(args: SelectSubset<T, LoanFundingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LoanFunding.
     * @param {LoanFundingUpsertArgs} args - Arguments to update or create a LoanFunding.
     * @example
     * // Update or create a LoanFunding
     * const loanFunding = await prisma.loanFunding.upsert({
     *   create: {
     *     // ... data to create a LoanFunding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoanFunding we want to update
     *   }
     * })
     */
    upsert<T extends LoanFundingUpsertArgs>(args: SelectSubset<T, LoanFundingUpsertArgs<ExtArgs>>): Prisma__LoanFundingClient<$Result.GetResult<Prisma.$LoanFundingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoanFundings that matches the filter.
     * @param {LoanFundingFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const loanFunding = await prisma.loanFunding.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: LoanFundingFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a LoanFunding.
     * @param {LoanFundingAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const loanFunding = await prisma.loanFunding.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: LoanFundingAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of LoanFundings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingCountArgs} args - Arguments to filter LoanFundings to count.
     * @example
     * // Count the number of LoanFundings
     * const count = await prisma.loanFunding.count({
     *   where: {
     *     // ... the filter for the LoanFundings we want to count
     *   }
     * })
    **/
    count<T extends LoanFundingCountArgs>(
      args?: Subset<T, LoanFundingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoanFundingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoanFunding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoanFundingAggregateArgs>(args: Subset<T, LoanFundingAggregateArgs>): Prisma.PrismaPromise<GetLoanFundingAggregateType<T>>

    /**
     * Group by LoanFunding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoanFundingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoanFundingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoanFundingGroupByArgs['orderBy'] }
        : { orderBy?: LoanFundingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoanFundingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoanFundingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoanFunding model
   */
  readonly fields: LoanFundingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoanFunding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoanFundingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    provider<T extends ProviderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProviderDefaultArgs<ExtArgs>>): Prisma__ProviderClient<$Result.GetResult<Prisma.$ProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoanFunding model
   */
  interface LoanFundingFieldRefs {
    readonly id: FieldRef<"LoanFunding", 'String'>
    readonly providerId: FieldRef<"LoanFunding", 'String'>
    readonly loanId: FieldRef<"LoanFunding", 'String'>
    readonly amount: FieldRef<"LoanFunding", 'Float'>
    readonly createdAt: FieldRef<"LoanFunding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoanFunding findUnique
   */
  export type LoanFundingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * Filter, which LoanFunding to fetch.
     */
    where: LoanFundingWhereUniqueInput
  }

  /**
   * LoanFunding findUniqueOrThrow
   */
  export type LoanFundingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * Filter, which LoanFunding to fetch.
     */
    where: LoanFundingWhereUniqueInput
  }

  /**
   * LoanFunding findFirst
   */
  export type LoanFundingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * Filter, which LoanFunding to fetch.
     */
    where?: LoanFundingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFundings to fetch.
     */
    orderBy?: LoanFundingOrderByWithRelationInput | LoanFundingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanFundings.
     */
    cursor?: LoanFundingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFundings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFundings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanFundings.
     */
    distinct?: LoanFundingScalarFieldEnum | LoanFundingScalarFieldEnum[]
  }

  /**
   * LoanFunding findFirstOrThrow
   */
  export type LoanFundingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * Filter, which LoanFunding to fetch.
     */
    where?: LoanFundingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFundings to fetch.
     */
    orderBy?: LoanFundingOrderByWithRelationInput | LoanFundingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoanFundings.
     */
    cursor?: LoanFundingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFundings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFundings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoanFundings.
     */
    distinct?: LoanFundingScalarFieldEnum | LoanFundingScalarFieldEnum[]
  }

  /**
   * LoanFunding findMany
   */
  export type LoanFundingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * Filter, which LoanFundings to fetch.
     */
    where?: LoanFundingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoanFundings to fetch.
     */
    orderBy?: LoanFundingOrderByWithRelationInput | LoanFundingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoanFundings.
     */
    cursor?: LoanFundingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoanFundings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoanFundings.
     */
    skip?: number
    distinct?: LoanFundingScalarFieldEnum | LoanFundingScalarFieldEnum[]
  }

  /**
   * LoanFunding create
   */
  export type LoanFundingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * The data needed to create a LoanFunding.
     */
    data: XOR<LoanFundingCreateInput, LoanFundingUncheckedCreateInput>
  }

  /**
   * LoanFunding createMany
   */
  export type LoanFundingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoanFundings.
     */
    data: LoanFundingCreateManyInput | LoanFundingCreateManyInput[]
  }

  /**
   * LoanFunding update
   */
  export type LoanFundingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * The data needed to update a LoanFunding.
     */
    data: XOR<LoanFundingUpdateInput, LoanFundingUncheckedUpdateInput>
    /**
     * Choose, which LoanFunding to update.
     */
    where: LoanFundingWhereUniqueInput
  }

  /**
   * LoanFunding updateMany
   */
  export type LoanFundingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoanFundings.
     */
    data: XOR<LoanFundingUpdateManyMutationInput, LoanFundingUncheckedUpdateManyInput>
    /**
     * Filter which LoanFundings to update
     */
    where?: LoanFundingWhereInput
    /**
     * Limit how many LoanFundings to update.
     */
    limit?: number
  }

  /**
   * LoanFunding upsert
   */
  export type LoanFundingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * The filter to search for the LoanFunding to update in case it exists.
     */
    where: LoanFundingWhereUniqueInput
    /**
     * In case the LoanFunding found by the `where` argument doesn't exist, create a new LoanFunding with this data.
     */
    create: XOR<LoanFundingCreateInput, LoanFundingUncheckedCreateInput>
    /**
     * In case the LoanFunding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoanFundingUpdateInput, LoanFundingUncheckedUpdateInput>
  }

  /**
   * LoanFunding delete
   */
  export type LoanFundingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
    /**
     * Filter which LoanFunding to delete.
     */
    where: LoanFundingWhereUniqueInput
  }

  /**
   * LoanFunding deleteMany
   */
  export type LoanFundingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoanFundings to delete
     */
    where?: LoanFundingWhereInput
    /**
     * Limit how many LoanFundings to delete.
     */
    limit?: number
  }

  /**
   * LoanFunding findRaw
   */
  export type LoanFundingFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LoanFunding aggregateRaw
   */
  export type LoanFundingAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LoanFunding without action
   */
  export type LoanFundingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoanFunding
     */
    select?: LoanFundingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoanFunding
     */
    omit?: LoanFundingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoanFundingInclude<ExtArgs> | null
  }


  /**
   * Model ProviderCredit
   */

  export type AggregateProviderCredit = {
    _count: ProviderCreditCountAggregateOutputType | null
    _avg: ProviderCreditAvgAggregateOutputType | null
    _sum: ProviderCreditSumAggregateOutputType | null
    _min: ProviderCreditMinAggregateOutputType | null
    _max: ProviderCreditMaxAggregateOutputType | null
  }

  export type ProviderCreditAvgAggregateOutputType = {
    amount: number | null
  }

  export type ProviderCreditSumAggregateOutputType = {
    amount: number | null
  }

  export type ProviderCreditMinAggregateOutputType = {
    id: string | null
    providerId: string | null
    amount: number | null
    loanId: string | null
    createdAt: Date | null
  }

  export type ProviderCreditMaxAggregateOutputType = {
    id: string | null
    providerId: string | null
    amount: number | null
    loanId: string | null
    createdAt: Date | null
  }

  export type ProviderCreditCountAggregateOutputType = {
    id: number
    providerId: number
    amount: number
    loanId: number
    createdAt: number
    _all: number
  }


  export type ProviderCreditAvgAggregateInputType = {
    amount?: true
  }

  export type ProviderCreditSumAggregateInputType = {
    amount?: true
  }

  export type ProviderCreditMinAggregateInputType = {
    id?: true
    providerId?: true
    amount?: true
    loanId?: true
    createdAt?: true
  }

  export type ProviderCreditMaxAggregateInputType = {
    id?: true
    providerId?: true
    amount?: true
    loanId?: true
    createdAt?: true
  }

  export type ProviderCreditCountAggregateInputType = {
    id?: true
    providerId?: true
    amount?: true
    loanId?: true
    createdAt?: true
    _all?: true
  }

  export type ProviderCreditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderCredit to aggregate.
     */
    where?: ProviderCreditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCredits to fetch.
     */
    orderBy?: ProviderCreditOrderByWithRelationInput | ProviderCreditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderCreditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCredits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCredits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProviderCredits
    **/
    _count?: true | ProviderCreditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProviderCreditAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProviderCreditSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderCreditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderCreditMaxAggregateInputType
  }

  export type GetProviderCreditAggregateType<T extends ProviderCreditAggregateArgs> = {
        [P in keyof T & keyof AggregateProviderCredit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderCredit[P]>
      : GetScalarType<T[P], AggregateProviderCredit[P]>
  }




  export type ProviderCreditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderCreditWhereInput
    orderBy?: ProviderCreditOrderByWithAggregationInput | ProviderCreditOrderByWithAggregationInput[]
    by: ProviderCreditScalarFieldEnum[] | ProviderCreditScalarFieldEnum
    having?: ProviderCreditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderCreditCountAggregateInputType | true
    _avg?: ProviderCreditAvgAggregateInputType
    _sum?: ProviderCreditSumAggregateInputType
    _min?: ProviderCreditMinAggregateInputType
    _max?: ProviderCreditMaxAggregateInputType
  }

  export type ProviderCreditGroupByOutputType = {
    id: string
    providerId: string
    amount: number
    loanId: string | null
    createdAt: Date
    _count: ProviderCreditCountAggregateOutputType | null
    _avg: ProviderCreditAvgAggregateOutputType | null
    _sum: ProviderCreditSumAggregateOutputType | null
    _min: ProviderCreditMinAggregateOutputType | null
    _max: ProviderCreditMaxAggregateOutputType | null
  }

  type GetProviderCreditGroupByPayload<T extends ProviderCreditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderCreditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderCreditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderCreditGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderCreditGroupByOutputType[P]>
        }
      >
    >


  export type ProviderCreditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    providerId?: boolean
    amount?: boolean
    loanId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["providerCredit"]>



  export type ProviderCreditSelectScalar = {
    id?: boolean
    providerId?: boolean
    amount?: boolean
    loanId?: boolean
    createdAt?: boolean
  }

  export type ProviderCreditOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "providerId" | "amount" | "loanId" | "createdAt", ExtArgs["result"]["providerCredit"]>

  export type $ProviderCreditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProviderCredit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      providerId: string
      amount: number
      loanId: string | null
      createdAt: Date
    }, ExtArgs["result"]["providerCredit"]>
    composites: {}
  }

  type ProviderCreditGetPayload<S extends boolean | null | undefined | ProviderCreditDefaultArgs> = $Result.GetResult<Prisma.$ProviderCreditPayload, S>

  type ProviderCreditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProviderCreditFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProviderCreditCountAggregateInputType | true
    }

  export interface ProviderCreditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProviderCredit'], meta: { name: 'ProviderCredit' } }
    /**
     * Find zero or one ProviderCredit that matches the filter.
     * @param {ProviderCreditFindUniqueArgs} args - Arguments to find a ProviderCredit
     * @example
     * // Get one ProviderCredit
     * const providerCredit = await prisma.providerCredit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderCreditFindUniqueArgs>(args: SelectSubset<T, ProviderCreditFindUniqueArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProviderCredit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProviderCreditFindUniqueOrThrowArgs} args - Arguments to find a ProviderCredit
     * @example
     * // Get one ProviderCredit
     * const providerCredit = await prisma.providerCredit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderCreditFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderCreditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProviderCredit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditFindFirstArgs} args - Arguments to find a ProviderCredit
     * @example
     * // Get one ProviderCredit
     * const providerCredit = await prisma.providerCredit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderCreditFindFirstArgs>(args?: SelectSubset<T, ProviderCreditFindFirstArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProviderCredit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditFindFirstOrThrowArgs} args - Arguments to find a ProviderCredit
     * @example
     * // Get one ProviderCredit
     * const providerCredit = await prisma.providerCredit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderCreditFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderCreditFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProviderCredits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProviderCredits
     * const providerCredits = await prisma.providerCredit.findMany()
     * 
     * // Get first 10 ProviderCredits
     * const providerCredits = await prisma.providerCredit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerCreditWithIdOnly = await prisma.providerCredit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderCreditFindManyArgs>(args?: SelectSubset<T, ProviderCreditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProviderCredit.
     * @param {ProviderCreditCreateArgs} args - Arguments to create a ProviderCredit.
     * @example
     * // Create one ProviderCredit
     * const ProviderCredit = await prisma.providerCredit.create({
     *   data: {
     *     // ... data to create a ProviderCredit
     *   }
     * })
     * 
     */
    create<T extends ProviderCreditCreateArgs>(args: SelectSubset<T, ProviderCreditCreateArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProviderCredits.
     * @param {ProviderCreditCreateManyArgs} args - Arguments to create many ProviderCredits.
     * @example
     * // Create many ProviderCredits
     * const providerCredit = await prisma.providerCredit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderCreditCreateManyArgs>(args?: SelectSubset<T, ProviderCreditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProviderCredit.
     * @param {ProviderCreditDeleteArgs} args - Arguments to delete one ProviderCredit.
     * @example
     * // Delete one ProviderCredit
     * const ProviderCredit = await prisma.providerCredit.delete({
     *   where: {
     *     // ... filter to delete one ProviderCredit
     *   }
     * })
     * 
     */
    delete<T extends ProviderCreditDeleteArgs>(args: SelectSubset<T, ProviderCreditDeleteArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProviderCredit.
     * @param {ProviderCreditUpdateArgs} args - Arguments to update one ProviderCredit.
     * @example
     * // Update one ProviderCredit
     * const providerCredit = await prisma.providerCredit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderCreditUpdateArgs>(args: SelectSubset<T, ProviderCreditUpdateArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProviderCredits.
     * @param {ProviderCreditDeleteManyArgs} args - Arguments to filter ProviderCredits to delete.
     * @example
     * // Delete a few ProviderCredits
     * const { count } = await prisma.providerCredit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderCreditDeleteManyArgs>(args?: SelectSubset<T, ProviderCreditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProviderCredits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProviderCredits
     * const providerCredit = await prisma.providerCredit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderCreditUpdateManyArgs>(args: SelectSubset<T, ProviderCreditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProviderCredit.
     * @param {ProviderCreditUpsertArgs} args - Arguments to update or create a ProviderCredit.
     * @example
     * // Update or create a ProviderCredit
     * const providerCredit = await prisma.providerCredit.upsert({
     *   create: {
     *     // ... data to create a ProviderCredit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProviderCredit we want to update
     *   }
     * })
     */
    upsert<T extends ProviderCreditUpsertArgs>(args: SelectSubset<T, ProviderCreditUpsertArgs<ExtArgs>>): Prisma__ProviderCreditClient<$Result.GetResult<Prisma.$ProviderCreditPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProviderCredits that matches the filter.
     * @param {ProviderCreditFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const providerCredit = await prisma.providerCredit.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ProviderCreditFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ProviderCredit.
     * @param {ProviderCreditAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const providerCredit = await prisma.providerCredit.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ProviderCreditAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of ProviderCredits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditCountArgs} args - Arguments to filter ProviderCredits to count.
     * @example
     * // Count the number of ProviderCredits
     * const count = await prisma.providerCredit.count({
     *   where: {
     *     // ... the filter for the ProviderCredits we want to count
     *   }
     * })
    **/
    count<T extends ProviderCreditCountArgs>(
      args?: Subset<T, ProviderCreditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderCreditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProviderCredit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProviderCreditAggregateArgs>(args: Subset<T, ProviderCreditAggregateArgs>): Prisma.PrismaPromise<GetProviderCreditAggregateType<T>>

    /**
     * Group by ProviderCredit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCreditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProviderCreditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderCreditGroupByArgs['orderBy'] }
        : { orderBy?: ProviderCreditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProviderCreditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderCreditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProviderCredit model
   */
  readonly fields: ProviderCreditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderCredit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderCreditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProviderCredit model
   */
  interface ProviderCreditFieldRefs {
    readonly id: FieldRef<"ProviderCredit", 'String'>
    readonly providerId: FieldRef<"ProviderCredit", 'String'>
    readonly amount: FieldRef<"ProviderCredit", 'Float'>
    readonly loanId: FieldRef<"ProviderCredit", 'String'>
    readonly createdAt: FieldRef<"ProviderCredit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProviderCredit findUnique
   */
  export type ProviderCreditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * Filter, which ProviderCredit to fetch.
     */
    where: ProviderCreditWhereUniqueInput
  }

  /**
   * ProviderCredit findUniqueOrThrow
   */
  export type ProviderCreditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * Filter, which ProviderCredit to fetch.
     */
    where: ProviderCreditWhereUniqueInput
  }

  /**
   * ProviderCredit findFirst
   */
  export type ProviderCreditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * Filter, which ProviderCredit to fetch.
     */
    where?: ProviderCreditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCredits to fetch.
     */
    orderBy?: ProviderCreditOrderByWithRelationInput | ProviderCreditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderCredits.
     */
    cursor?: ProviderCreditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCredits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCredits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderCredits.
     */
    distinct?: ProviderCreditScalarFieldEnum | ProviderCreditScalarFieldEnum[]
  }

  /**
   * ProviderCredit findFirstOrThrow
   */
  export type ProviderCreditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * Filter, which ProviderCredit to fetch.
     */
    where?: ProviderCreditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCredits to fetch.
     */
    orderBy?: ProviderCreditOrderByWithRelationInput | ProviderCreditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderCredits.
     */
    cursor?: ProviderCreditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCredits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCredits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderCredits.
     */
    distinct?: ProviderCreditScalarFieldEnum | ProviderCreditScalarFieldEnum[]
  }

  /**
   * ProviderCredit findMany
   */
  export type ProviderCreditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * Filter, which ProviderCredits to fetch.
     */
    where?: ProviderCreditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCredits to fetch.
     */
    orderBy?: ProviderCreditOrderByWithRelationInput | ProviderCreditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProviderCredits.
     */
    cursor?: ProviderCreditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCredits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCredits.
     */
    skip?: number
    distinct?: ProviderCreditScalarFieldEnum | ProviderCreditScalarFieldEnum[]
  }

  /**
   * ProviderCredit create
   */
  export type ProviderCreditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * The data needed to create a ProviderCredit.
     */
    data: XOR<ProviderCreditCreateInput, ProviderCreditUncheckedCreateInput>
  }

  /**
   * ProviderCredit createMany
   */
  export type ProviderCreditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProviderCredits.
     */
    data: ProviderCreditCreateManyInput | ProviderCreditCreateManyInput[]
  }

  /**
   * ProviderCredit update
   */
  export type ProviderCreditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * The data needed to update a ProviderCredit.
     */
    data: XOR<ProviderCreditUpdateInput, ProviderCreditUncheckedUpdateInput>
    /**
     * Choose, which ProviderCredit to update.
     */
    where: ProviderCreditWhereUniqueInput
  }

  /**
   * ProviderCredit updateMany
   */
  export type ProviderCreditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProviderCredits.
     */
    data: XOR<ProviderCreditUpdateManyMutationInput, ProviderCreditUncheckedUpdateManyInput>
    /**
     * Filter which ProviderCredits to update
     */
    where?: ProviderCreditWhereInput
    /**
     * Limit how many ProviderCredits to update.
     */
    limit?: number
  }

  /**
   * ProviderCredit upsert
   */
  export type ProviderCreditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * The filter to search for the ProviderCredit to update in case it exists.
     */
    where: ProviderCreditWhereUniqueInput
    /**
     * In case the ProviderCredit found by the `where` argument doesn't exist, create a new ProviderCredit with this data.
     */
    create: XOR<ProviderCreditCreateInput, ProviderCreditUncheckedCreateInput>
    /**
     * In case the ProviderCredit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderCreditUpdateInput, ProviderCreditUncheckedUpdateInput>
  }

  /**
   * ProviderCredit delete
   */
  export type ProviderCreditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
    /**
     * Filter which ProviderCredit to delete.
     */
    where: ProviderCreditWhereUniqueInput
  }

  /**
   * ProviderCredit deleteMany
   */
  export type ProviderCreditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderCredits to delete
     */
    where?: ProviderCreditWhereInput
    /**
     * Limit how many ProviderCredits to delete.
     */
    limit?: number
  }

  /**
   * ProviderCredit findRaw
   */
  export type ProviderCreditFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ProviderCredit aggregateRaw
   */
  export type ProviderCreditAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ProviderCredit without action
   */
  export type ProviderCreditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCredit
     */
    select?: ProviderCreditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProviderCredit
     */
    omit?: ProviderCreditOmit<ExtArgs> | null
  }


  /**
   * Model Employee
   */

  export type AggregateEmployee = {
    _count: EmployeeCountAggregateOutputType | null
    _min: EmployeeMinAggregateOutputType | null
    _max: EmployeeMaxAggregateOutputType | null
  }

  export type EmployeeMinAggregateOutputType = {
    id: string | null
    employeeNumber: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    role: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmployeeMaxAggregateOutputType = {
    id: string | null
    employeeNumber: string | null
    email: string | null
    password: string | null
    firstName: string | null
    lastName: string | null
    role: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmployeeCountAggregateOutputType = {
    id: number
    employeeNumber: number
    email: number
    password: number
    firstName: number
    lastName: number
    role: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EmployeeMinAggregateInputType = {
    id?: true
    employeeNumber?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    role?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmployeeMaxAggregateInputType = {
    id?: true
    employeeNumber?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    role?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmployeeCountAggregateInputType = {
    id?: true
    employeeNumber?: true
    email?: true
    password?: true
    firstName?: true
    lastName?: true
    role?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EmployeeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Employee to aggregate.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Employees
    **/
    _count?: true | EmployeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmployeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmployeeMaxAggregateInputType
  }

  export type GetEmployeeAggregateType<T extends EmployeeAggregateArgs> = {
        [P in keyof T & keyof AggregateEmployee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmployee[P]>
      : GetScalarType<T[P], AggregateEmployee[P]>
  }




  export type EmployeeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithAggregationInput | EmployeeOrderByWithAggregationInput[]
    by: EmployeeScalarFieldEnum[] | EmployeeScalarFieldEnum
    having?: EmployeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmployeeCountAggregateInputType | true
    _min?: EmployeeMinAggregateInputType
    _max?: EmployeeMaxAggregateInputType
  }

  export type EmployeeGroupByOutputType = {
    id: string
    employeeNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: EmployeeCountAggregateOutputType | null
    _min: EmployeeMinAggregateOutputType | null
    _max: EmployeeMaxAggregateOutputType | null
  }

  type GetEmployeeGroupByPayload<T extends EmployeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmployeeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmployeeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmployeeGroupByOutputType[P]>
            : GetScalarType<T[P], EmployeeGroupByOutputType[P]>
        }
      >
    >


  export type EmployeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeNumber?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["employee"]>



  export type EmployeeSelectScalar = {
    id?: boolean
    employeeNumber?: boolean
    email?: boolean
    password?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EmployeeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "employeeNumber" | "email" | "password" | "firstName" | "lastName" | "role" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["employee"]>

  export type $EmployeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Employee"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeNumber: string
      email: string
      password: string
      firstName: string
      lastName: string
      role: string
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["employee"]>
    composites: {}
  }

  type EmployeeGetPayload<S extends boolean | null | undefined | EmployeeDefaultArgs> = $Result.GetResult<Prisma.$EmployeePayload, S>

  type EmployeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmployeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmployeeCountAggregateInputType | true
    }

  export interface EmployeeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Employee'], meta: { name: 'Employee' } }
    /**
     * Find zero or one Employee that matches the filter.
     * @param {EmployeeFindUniqueArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmployeeFindUniqueArgs>(args: SelectSubset<T, EmployeeFindUniqueArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Employee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmployeeFindUniqueOrThrowArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmployeeFindUniqueOrThrowArgs>(args: SelectSubset<T, EmployeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Employee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindFirstArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmployeeFindFirstArgs>(args?: SelectSubset<T, EmployeeFindFirstArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Employee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindFirstOrThrowArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmployeeFindFirstOrThrowArgs>(args?: SelectSubset<T, EmployeeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Employees
     * const employees = await prisma.employee.findMany()
     * 
     * // Get first 10 Employees
     * const employees = await prisma.employee.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const employeeWithIdOnly = await prisma.employee.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmployeeFindManyArgs>(args?: SelectSubset<T, EmployeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Employee.
     * @param {EmployeeCreateArgs} args - Arguments to create a Employee.
     * @example
     * // Create one Employee
     * const Employee = await prisma.employee.create({
     *   data: {
     *     // ... data to create a Employee
     *   }
     * })
     * 
     */
    create<T extends EmployeeCreateArgs>(args: SelectSubset<T, EmployeeCreateArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Employees.
     * @param {EmployeeCreateManyArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employee = await prisma.employee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmployeeCreateManyArgs>(args?: SelectSubset<T, EmployeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Employee.
     * @param {EmployeeDeleteArgs} args - Arguments to delete one Employee.
     * @example
     * // Delete one Employee
     * const Employee = await prisma.employee.delete({
     *   where: {
     *     // ... filter to delete one Employee
     *   }
     * })
     * 
     */
    delete<T extends EmployeeDeleteArgs>(args: SelectSubset<T, EmployeeDeleteArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Employee.
     * @param {EmployeeUpdateArgs} args - Arguments to update one Employee.
     * @example
     * // Update one Employee
     * const employee = await prisma.employee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmployeeUpdateArgs>(args: SelectSubset<T, EmployeeUpdateArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Employees.
     * @param {EmployeeDeleteManyArgs} args - Arguments to filter Employees to delete.
     * @example
     * // Delete a few Employees
     * const { count } = await prisma.employee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmployeeDeleteManyArgs>(args?: SelectSubset<T, EmployeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Employees
     * const employee = await prisma.employee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmployeeUpdateManyArgs>(args: SelectSubset<T, EmployeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Employee.
     * @param {EmployeeUpsertArgs} args - Arguments to update or create a Employee.
     * @example
     * // Update or create a Employee
     * const employee = await prisma.employee.upsert({
     *   create: {
     *     // ... data to create a Employee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Employee we want to update
     *   }
     * })
     */
    upsert<T extends EmployeeUpsertArgs>(args: SelectSubset<T, EmployeeUpsertArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Employees that matches the filter.
     * @param {EmployeeFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const employee = await prisma.employee.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: EmployeeFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Employee.
     * @param {EmployeeAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const employee = await prisma.employee.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: EmployeeAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeCountArgs} args - Arguments to filter Employees to count.
     * @example
     * // Count the number of Employees
     * const count = await prisma.employee.count({
     *   where: {
     *     // ... the filter for the Employees we want to count
     *   }
     * })
    **/
    count<T extends EmployeeCountArgs>(
      args?: Subset<T, EmployeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmployeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Employee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmployeeAggregateArgs>(args: Subset<T, EmployeeAggregateArgs>): Prisma.PrismaPromise<GetEmployeeAggregateType<T>>

    /**
     * Group by Employee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmployeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmployeeGroupByArgs['orderBy'] }
        : { orderBy?: EmployeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmployeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Employee model
   */
  readonly fields: EmployeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Employee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmployeeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Employee model
   */
  interface EmployeeFieldRefs {
    readonly id: FieldRef<"Employee", 'String'>
    readonly employeeNumber: FieldRef<"Employee", 'String'>
    readonly email: FieldRef<"Employee", 'String'>
    readonly password: FieldRef<"Employee", 'String'>
    readonly firstName: FieldRef<"Employee", 'String'>
    readonly lastName: FieldRef<"Employee", 'String'>
    readonly role: FieldRef<"Employee", 'String'>
    readonly active: FieldRef<"Employee", 'Boolean'>
    readonly createdAt: FieldRef<"Employee", 'DateTime'>
    readonly updatedAt: FieldRef<"Employee", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Employee findUnique
   */
  export type EmployeeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee findUniqueOrThrow
   */
  export type EmployeeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee findFirst
   */
  export type EmployeeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Employees.
     */
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee findFirstOrThrow
   */
  export type EmployeeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Employees.
     */
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee findMany
   */
  export type EmployeeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Filter, which Employees to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee create
   */
  export type EmployeeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * The data needed to create a Employee.
     */
    data: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>
  }

  /**
   * Employee createMany
   */
  export type EmployeeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Employees.
     */
    data: EmployeeCreateManyInput | EmployeeCreateManyInput[]
  }

  /**
   * Employee update
   */
  export type EmployeeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * The data needed to update a Employee.
     */
    data: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>
    /**
     * Choose, which Employee to update.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee updateMany
   */
  export type EmployeeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Employees.
     */
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyInput>
    /**
     * Filter which Employees to update
     */
    where?: EmployeeWhereInput
    /**
     * Limit how many Employees to update.
     */
    limit?: number
  }

  /**
   * Employee upsert
   */
  export type EmployeeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * The filter to search for the Employee to update in case it exists.
     */
    where: EmployeeWhereUniqueInput
    /**
     * In case the Employee found by the `where` argument doesn't exist, create a new Employee with this data.
     */
    create: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>
    /**
     * In case the Employee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>
  }

  /**
   * Employee delete
   */
  export type EmployeeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
    /**
     * Filter which Employee to delete.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee deleteMany
   */
  export type EmployeeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Employees to delete
     */
    where?: EmployeeWhereInput
    /**
     * Limit how many Employees to delete.
     */
    limit?: number
  }

  /**
   * Employee findRaw
   */
  export type EmployeeFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Employee aggregateRaw
   */
  export type EmployeeAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Employee without action
   */
  export type EmployeeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Employee
     */
    omit?: EmployeeOmit<ExtArgs> | null
  }


  /**
   * Model AdminActivity
   */

  export type AggregateAdminActivity = {
    _count: AdminActivityCountAggregateOutputType | null
    _min: AdminActivityMinAggregateOutputType | null
    _max: AdminActivityMaxAggregateOutputType | null
  }

  export type AdminActivityMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    ip: string | null
    createdAt: Date | null
  }

  export type AdminActivityMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    ip: string | null
    createdAt: Date | null
  }

  export type AdminActivityCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    ip: number
    createdAt: number
    _all: number
  }


  export type AdminActivityMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    ip?: true
    createdAt?: true
  }

  export type AdminActivityMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    ip?: true
    createdAt?: true
  }

  export type AdminActivityCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    ip?: true
    createdAt?: true
    _all?: true
  }

  export type AdminActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminActivity to aggregate.
     */
    where?: AdminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActivities to fetch.
     */
    orderBy?: AdminActivityOrderByWithRelationInput | AdminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminActivities
    **/
    _count?: true | AdminActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminActivityMaxAggregateInputType
  }

  export type GetAdminActivityAggregateType<T extends AdminActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminActivity[P]>
      : GetScalarType<T[P], AggregateAdminActivity[P]>
  }




  export type AdminActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminActivityWhereInput
    orderBy?: AdminActivityOrderByWithAggregationInput | AdminActivityOrderByWithAggregationInput[]
    by: AdminActivityScalarFieldEnum[] | AdminActivityScalarFieldEnum
    having?: AdminActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminActivityCountAggregateInputType | true
    _min?: AdminActivityMinAggregateInputType
    _max?: AdminActivityMaxAggregateInputType
  }

  export type AdminActivityGroupByOutputType = {
    id: string
    userId: string
    action: string
    ip: string | null
    createdAt: Date
    _count: AdminActivityCountAggregateOutputType | null
    _min: AdminActivityMinAggregateOutputType | null
    _max: AdminActivityMaxAggregateOutputType | null
  }

  type GetAdminActivityGroupByPayload<T extends AdminActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminActivityGroupByOutputType[P]>
            : GetScalarType<T[P], AdminActivityGroupByOutputType[P]>
        }
      >
    >


  export type AdminActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    ip?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminActivity"]>



  export type AdminActivitySelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    ip?: boolean
    createdAt?: boolean
  }

  export type AdminActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "ip" | "createdAt", ExtArgs["result"]["adminActivity"]>

  export type $AdminActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminActivity"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      action: string
      ip: string | null
      createdAt: Date
    }, ExtArgs["result"]["adminActivity"]>
    composites: {}
  }

  type AdminActivityGetPayload<S extends boolean | null | undefined | AdminActivityDefaultArgs> = $Result.GetResult<Prisma.$AdminActivityPayload, S>

  type AdminActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminActivityCountAggregateInputType | true
    }

  export interface AdminActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminActivity'], meta: { name: 'AdminActivity' } }
    /**
     * Find zero or one AdminActivity that matches the filter.
     * @param {AdminActivityFindUniqueArgs} args - Arguments to find a AdminActivity
     * @example
     * // Get one AdminActivity
     * const adminActivity = await prisma.adminActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminActivityFindUniqueArgs>(args: SelectSubset<T, AdminActivityFindUniqueArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminActivityFindUniqueOrThrowArgs} args - Arguments to find a AdminActivity
     * @example
     * // Get one AdminActivity
     * const adminActivity = await prisma.adminActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityFindFirstArgs} args - Arguments to find a AdminActivity
     * @example
     * // Get one AdminActivity
     * const adminActivity = await prisma.adminActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminActivityFindFirstArgs>(args?: SelectSubset<T, AdminActivityFindFirstArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityFindFirstOrThrowArgs} args - Arguments to find a AdminActivity
     * @example
     * // Get one AdminActivity
     * const adminActivity = await prisma.adminActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminActivities
     * const adminActivities = await prisma.adminActivity.findMany()
     * 
     * // Get first 10 AdminActivities
     * const adminActivities = await prisma.adminActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminActivityWithIdOnly = await prisma.adminActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminActivityFindManyArgs>(args?: SelectSubset<T, AdminActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminActivity.
     * @param {AdminActivityCreateArgs} args - Arguments to create a AdminActivity.
     * @example
     * // Create one AdminActivity
     * const AdminActivity = await prisma.adminActivity.create({
     *   data: {
     *     // ... data to create a AdminActivity
     *   }
     * })
     * 
     */
    create<T extends AdminActivityCreateArgs>(args: SelectSubset<T, AdminActivityCreateArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminActivities.
     * @param {AdminActivityCreateManyArgs} args - Arguments to create many AdminActivities.
     * @example
     * // Create many AdminActivities
     * const adminActivity = await prisma.adminActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminActivityCreateManyArgs>(args?: SelectSubset<T, AdminActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AdminActivity.
     * @param {AdminActivityDeleteArgs} args - Arguments to delete one AdminActivity.
     * @example
     * // Delete one AdminActivity
     * const AdminActivity = await prisma.adminActivity.delete({
     *   where: {
     *     // ... filter to delete one AdminActivity
     *   }
     * })
     * 
     */
    delete<T extends AdminActivityDeleteArgs>(args: SelectSubset<T, AdminActivityDeleteArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminActivity.
     * @param {AdminActivityUpdateArgs} args - Arguments to update one AdminActivity.
     * @example
     * // Update one AdminActivity
     * const adminActivity = await prisma.adminActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminActivityUpdateArgs>(args: SelectSubset<T, AdminActivityUpdateArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminActivities.
     * @param {AdminActivityDeleteManyArgs} args - Arguments to filter AdminActivities to delete.
     * @example
     * // Delete a few AdminActivities
     * const { count } = await prisma.adminActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminActivityDeleteManyArgs>(args?: SelectSubset<T, AdminActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminActivities
     * const adminActivity = await prisma.adminActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminActivityUpdateManyArgs>(args: SelectSubset<T, AdminActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminActivity.
     * @param {AdminActivityUpsertArgs} args - Arguments to update or create a AdminActivity.
     * @example
     * // Update or create a AdminActivity
     * const adminActivity = await prisma.adminActivity.upsert({
     *   create: {
     *     // ... data to create a AdminActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminActivity we want to update
     *   }
     * })
     */
    upsert<T extends AdminActivityUpsertArgs>(args: SelectSubset<T, AdminActivityUpsertArgs<ExtArgs>>): Prisma__AdminActivityClient<$Result.GetResult<Prisma.$AdminActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminActivities that matches the filter.
     * @param {AdminActivityFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const adminActivity = await prisma.adminActivity.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: AdminActivityFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a AdminActivity.
     * @param {AdminActivityAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const adminActivity = await prisma.adminActivity.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: AdminActivityAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of AdminActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityCountArgs} args - Arguments to filter AdminActivities to count.
     * @example
     * // Count the number of AdminActivities
     * const count = await prisma.adminActivity.count({
     *   where: {
     *     // ... the filter for the AdminActivities we want to count
     *   }
     * })
    **/
    count<T extends AdminActivityCountArgs>(
      args?: Subset<T, AdminActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminActivityAggregateArgs>(args: Subset<T, AdminActivityAggregateArgs>): Prisma.PrismaPromise<GetAdminActivityAggregateType<T>>

    /**
     * Group by AdminActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminActivityGroupByArgs['orderBy'] }
        : { orderBy?: AdminActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminActivity model
   */
  readonly fields: AdminActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminActivity model
   */
  interface AdminActivityFieldRefs {
    readonly id: FieldRef<"AdminActivity", 'String'>
    readonly userId: FieldRef<"AdminActivity", 'String'>
    readonly action: FieldRef<"AdminActivity", 'String'>
    readonly ip: FieldRef<"AdminActivity", 'String'>
    readonly createdAt: FieldRef<"AdminActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminActivity findUnique
   */
  export type AdminActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * Filter, which AdminActivity to fetch.
     */
    where: AdminActivityWhereUniqueInput
  }

  /**
   * AdminActivity findUniqueOrThrow
   */
  export type AdminActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * Filter, which AdminActivity to fetch.
     */
    where: AdminActivityWhereUniqueInput
  }

  /**
   * AdminActivity findFirst
   */
  export type AdminActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * Filter, which AdminActivity to fetch.
     */
    where?: AdminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActivities to fetch.
     */
    orderBy?: AdminActivityOrderByWithRelationInput | AdminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminActivities.
     */
    cursor?: AdminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminActivities.
     */
    distinct?: AdminActivityScalarFieldEnum | AdminActivityScalarFieldEnum[]
  }

  /**
   * AdminActivity findFirstOrThrow
   */
  export type AdminActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * Filter, which AdminActivity to fetch.
     */
    where?: AdminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActivities to fetch.
     */
    orderBy?: AdminActivityOrderByWithRelationInput | AdminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminActivities.
     */
    cursor?: AdminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminActivities.
     */
    distinct?: AdminActivityScalarFieldEnum | AdminActivityScalarFieldEnum[]
  }

  /**
   * AdminActivity findMany
   */
  export type AdminActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * Filter, which AdminActivities to fetch.
     */
    where?: AdminActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActivities to fetch.
     */
    orderBy?: AdminActivityOrderByWithRelationInput | AdminActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminActivities.
     */
    cursor?: AdminActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActivities.
     */
    skip?: number
    distinct?: AdminActivityScalarFieldEnum | AdminActivityScalarFieldEnum[]
  }

  /**
   * AdminActivity create
   */
  export type AdminActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * The data needed to create a AdminActivity.
     */
    data: XOR<AdminActivityCreateInput, AdminActivityUncheckedCreateInput>
  }

  /**
   * AdminActivity createMany
   */
  export type AdminActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminActivities.
     */
    data: AdminActivityCreateManyInput | AdminActivityCreateManyInput[]
  }

  /**
   * AdminActivity update
   */
  export type AdminActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * The data needed to update a AdminActivity.
     */
    data: XOR<AdminActivityUpdateInput, AdminActivityUncheckedUpdateInput>
    /**
     * Choose, which AdminActivity to update.
     */
    where: AdminActivityWhereUniqueInput
  }

  /**
   * AdminActivity updateMany
   */
  export type AdminActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminActivities.
     */
    data: XOR<AdminActivityUpdateManyMutationInput, AdminActivityUncheckedUpdateManyInput>
    /**
     * Filter which AdminActivities to update
     */
    where?: AdminActivityWhereInput
    /**
     * Limit how many AdminActivities to update.
     */
    limit?: number
  }

  /**
   * AdminActivity upsert
   */
  export type AdminActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * The filter to search for the AdminActivity to update in case it exists.
     */
    where: AdminActivityWhereUniqueInput
    /**
     * In case the AdminActivity found by the `where` argument doesn't exist, create a new AdminActivity with this data.
     */
    create: XOR<AdminActivityCreateInput, AdminActivityUncheckedCreateInput>
    /**
     * In case the AdminActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminActivityUpdateInput, AdminActivityUncheckedUpdateInput>
  }

  /**
   * AdminActivity delete
   */
  export type AdminActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
    /**
     * Filter which AdminActivity to delete.
     */
    where: AdminActivityWhereUniqueInput
  }

  /**
   * AdminActivity deleteMany
   */
  export type AdminActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminActivities to delete
     */
    where?: AdminActivityWhereInput
    /**
     * Limit how many AdminActivities to delete.
     */
    limit?: number
  }

  /**
   * AdminActivity findRaw
   */
  export type AdminActivityFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AdminActivity aggregateRaw
   */
  export type AdminActivityAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * AdminActivity without action
   */
  export type AdminActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminActivity
     */
    select?: AdminActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminActivity
     */
    omit?: AdminActivityOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const UserScalarFieldEnum: {
    id: 'id',
    userNumber: 'userNumber',
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    nin: 'nin',
    picture: 'picture',
    role: 'role',
    verified: 'verified',
    suspended: 'suspended',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LoginCodeScalarFieldEnum: {
    id: 'id',
    email: 'email',
    code: 'code',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type LoginCodeScalarFieldEnum = (typeof LoginCodeScalarFieldEnum)[keyof typeof LoginCodeScalarFieldEnum]


  export const PasswordResetCodeScalarFieldEnum: {
    id: 'id',
    email: 'email',
    token: 'token',
    code: 'code',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetCodeScalarFieldEnum = (typeof PasswordResetCodeScalarFieldEnum)[keyof typeof PasswordResetCodeScalarFieldEnum]


  export const PendingRegistrationScalarFieldEnum: {
    id: 'id',
    email: 'email',
    code: 'code',
    expiresAt: 'expiresAt',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    nin: 'nin',
    picture: 'picture',
    createdAt: 'createdAt'
  };

  export type PendingRegistrationScalarFieldEnum = (typeof PendingRegistrationScalarFieldEnum)[keyof typeof PendingRegistrationScalarFieldEnum]


  export const WalletScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    balance: 'balance',
    currency: 'currency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WalletScalarFieldEnum = (typeof WalletScalarFieldEnum)[keyof typeof WalletScalarFieldEnum]


  export const LoanScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    amount: 'amount',
    purpose: 'purpose',
    status: 'status',
    dueDate: 'dueDate',
    disbursedAt: 'disbursedAt',
    amountRepaid: 'amountRepaid',
    repaidAt: 'repaidAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LoanScalarFieldEnum = (typeof LoanScalarFieldEnum)[keyof typeof LoanScalarFieldEnum]


  export const ProviderScalarFieldEnum: {
    id: 'id',
    providerNumber: 'providerNumber',
    name: 'name',
    email: 'email',
    agreedAmount: 'agreedAmount',
    percentageToAdd: 'percentageToAdd',
    agreedAt: 'agreedAt',
    agreedTerms: 'agreedTerms',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProviderScalarFieldEnum = (typeof ProviderScalarFieldEnum)[keyof typeof ProviderScalarFieldEnum]


  export const ProviderWalletScalarFieldEnum: {
    id: 'id',
    providerId: 'providerId',
    balance: 'balance',
    totalFunded: 'totalFunded',
    currency: 'currency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProviderWalletScalarFieldEnum = (typeof ProviderWalletScalarFieldEnum)[keyof typeof ProviderWalletScalarFieldEnum]


  export const LoanFundingScalarFieldEnum: {
    id: 'id',
    providerId: 'providerId',
    loanId: 'loanId',
    amount: 'amount',
    createdAt: 'createdAt'
  };

  export type LoanFundingScalarFieldEnum = (typeof LoanFundingScalarFieldEnum)[keyof typeof LoanFundingScalarFieldEnum]


  export const ProviderCreditScalarFieldEnum: {
    id: 'id',
    providerId: 'providerId',
    amount: 'amount',
    loanId: 'loanId',
    createdAt: 'createdAt'
  };

  export type ProviderCreditScalarFieldEnum = (typeof ProviderCreditScalarFieldEnum)[keyof typeof ProviderCreditScalarFieldEnum]


  export const EmployeeScalarFieldEnum: {
    id: 'id',
    employeeNumber: 'employeeNumber',
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    role: 'role',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EmployeeScalarFieldEnum = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum]


  export const AdminActivityScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    ip: 'ip',
    createdAt: 'createdAt'
  };

  export type AdminActivityScalarFieldEnum = (typeof AdminActivityScalarFieldEnum)[keyof typeof AdminActivityScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    userNumber?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    nin?: StringFilter<"User"> | string
    picture?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    verified?: BoolFilter<"User"> | boolean
    suspended?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    userNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    role?: SortOrder
    verified?: SortOrder
    suspended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userNumber?: string
    email?: string
    nin?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    picture?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    verified?: BoolFilter<"User"> | boolean
    suspended?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "userNumber" | "email" | "nin">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    userNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    role?: SortOrder
    verified?: SortOrder
    suspended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    userNumber?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    nin?: StringWithAggregatesFilter<"User"> | string
    picture?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    verified?: BoolWithAggregatesFilter<"User"> | boolean
    suspended?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type LoginCodeWhereInput = {
    AND?: LoginCodeWhereInput | LoginCodeWhereInput[]
    OR?: LoginCodeWhereInput[]
    NOT?: LoginCodeWhereInput | LoginCodeWhereInput[]
    id?: StringFilter<"LoginCode"> | string
    email?: StringFilter<"LoginCode"> | string
    code?: StringFilter<"LoginCode"> | string
    expiresAt?: DateTimeFilter<"LoginCode"> | Date | string
    createdAt?: DateTimeFilter<"LoginCode"> | Date | string
  }

  export type LoginCodeOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoginCodeWhereInput | LoginCodeWhereInput[]
    OR?: LoginCodeWhereInput[]
    NOT?: LoginCodeWhereInput | LoginCodeWhereInput[]
    email?: StringFilter<"LoginCode"> | string
    code?: StringFilter<"LoginCode"> | string
    expiresAt?: DateTimeFilter<"LoginCode"> | Date | string
    createdAt?: DateTimeFilter<"LoginCode"> | Date | string
  }, "id">

  export type LoginCodeOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: LoginCodeCountOrderByAggregateInput
    _max?: LoginCodeMaxOrderByAggregateInput
    _min?: LoginCodeMinOrderByAggregateInput
  }

  export type LoginCodeScalarWhereWithAggregatesInput = {
    AND?: LoginCodeScalarWhereWithAggregatesInput | LoginCodeScalarWhereWithAggregatesInput[]
    OR?: LoginCodeScalarWhereWithAggregatesInput[]
    NOT?: LoginCodeScalarWhereWithAggregatesInput | LoginCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoginCode"> | string
    email?: StringWithAggregatesFilter<"LoginCode"> | string
    code?: StringWithAggregatesFilter<"LoginCode"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"LoginCode"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"LoginCode"> | Date | string
  }

  export type PasswordResetCodeWhereInput = {
    AND?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    OR?: PasswordResetCodeWhereInput[]
    NOT?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    id?: StringFilter<"PasswordResetCode"> | string
    email?: StringFilter<"PasswordResetCode"> | string
    token?: StringFilter<"PasswordResetCode"> | string
    code?: StringFilter<"PasswordResetCode"> | string
    expiresAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    createdAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
  }

  export type PasswordResetCodeOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    OR?: PasswordResetCodeWhereInput[]
    NOT?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    email?: StringFilter<"PasswordResetCode"> | string
    code?: StringFilter<"PasswordResetCode"> | string
    expiresAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    createdAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
  }, "id" | "token">

  export type PasswordResetCodeOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetCodeCountOrderByAggregateInput
    _max?: PasswordResetCodeMaxOrderByAggregateInput
    _min?: PasswordResetCodeMinOrderByAggregateInput
  }

  export type PasswordResetCodeScalarWhereWithAggregatesInput = {
    AND?: PasswordResetCodeScalarWhereWithAggregatesInput | PasswordResetCodeScalarWhereWithAggregatesInput[]
    OR?: PasswordResetCodeScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetCodeScalarWhereWithAggregatesInput | PasswordResetCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    email?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    token?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    code?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string
  }

  export type PendingRegistrationWhereInput = {
    AND?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    OR?: PendingRegistrationWhereInput[]
    NOT?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    id?: StringFilter<"PendingRegistration"> | string
    email?: StringFilter<"PendingRegistration"> | string
    code?: StringFilter<"PendingRegistration"> | string
    expiresAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    passwordHash?: StringFilter<"PendingRegistration"> | string
    firstName?: StringFilter<"PendingRegistration"> | string
    lastName?: StringFilter<"PendingRegistration"> | string
    nin?: StringFilter<"PendingRegistration"> | string
    picture?: StringNullableFilter<"PendingRegistration"> | string | null
    createdAt?: DateTimeFilter<"PendingRegistration"> | Date | string
  }

  export type PendingRegistrationOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingRegistrationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    OR?: PendingRegistrationWhereInput[]
    NOT?: PendingRegistrationWhereInput | PendingRegistrationWhereInput[]
    email?: StringFilter<"PendingRegistration"> | string
    code?: StringFilter<"PendingRegistration"> | string
    expiresAt?: DateTimeFilter<"PendingRegistration"> | Date | string
    passwordHash?: StringFilter<"PendingRegistration"> | string
    firstName?: StringFilter<"PendingRegistration"> | string
    lastName?: StringFilter<"PendingRegistration"> | string
    nin?: StringFilter<"PendingRegistration"> | string
    picture?: StringNullableFilter<"PendingRegistration"> | string | null
    createdAt?: DateTimeFilter<"PendingRegistration"> | Date | string
  }, "id">

  export type PendingRegistrationOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    createdAt?: SortOrder
    _count?: PendingRegistrationCountOrderByAggregateInput
    _max?: PendingRegistrationMaxOrderByAggregateInput
    _min?: PendingRegistrationMinOrderByAggregateInput
  }

  export type PendingRegistrationScalarWhereWithAggregatesInput = {
    AND?: PendingRegistrationScalarWhereWithAggregatesInput | PendingRegistrationScalarWhereWithAggregatesInput[]
    OR?: PendingRegistrationScalarWhereWithAggregatesInput[]
    NOT?: PendingRegistrationScalarWhereWithAggregatesInput | PendingRegistrationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PendingRegistration"> | string
    email?: StringWithAggregatesFilter<"PendingRegistration"> | string
    code?: StringWithAggregatesFilter<"PendingRegistration"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string
    passwordHash?: StringWithAggregatesFilter<"PendingRegistration"> | string
    firstName?: StringWithAggregatesFilter<"PendingRegistration"> | string
    lastName?: StringWithAggregatesFilter<"PendingRegistration"> | string
    nin?: StringWithAggregatesFilter<"PendingRegistration"> | string
    picture?: StringNullableWithAggregatesFilter<"PendingRegistration"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PendingRegistration"> | Date | string
  }

  export type WalletWhereInput = {
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    id?: StringFilter<"Wallet"> | string
    userId?: StringFilter<"Wallet"> | string
    balance?: FloatFilter<"Wallet"> | number
    currency?: StringFilter<"Wallet"> | string
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
  }

  export type WalletOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    balance?: FloatFilter<"Wallet"> | number
    currency?: StringFilter<"Wallet"> | string
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeFilter<"Wallet"> | Date | string
  }, "id" | "userId">

  export type WalletOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WalletCountOrderByAggregateInput
    _avg?: WalletAvgOrderByAggregateInput
    _max?: WalletMaxOrderByAggregateInput
    _min?: WalletMinOrderByAggregateInput
    _sum?: WalletSumOrderByAggregateInput
  }

  export type WalletScalarWhereWithAggregatesInput = {
    AND?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    OR?: WalletScalarWhereWithAggregatesInput[]
    NOT?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wallet"> | string
    userId?: StringWithAggregatesFilter<"Wallet"> | string
    balance?: FloatWithAggregatesFilter<"Wallet"> | number
    currency?: StringWithAggregatesFilter<"Wallet"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
  }

  export type LoanWhereInput = {
    AND?: LoanWhereInput | LoanWhereInput[]
    OR?: LoanWhereInput[]
    NOT?: LoanWhereInput | LoanWhereInput[]
    id?: StringFilter<"Loan"> | string
    userId?: StringFilter<"Loan"> | string
    amount?: FloatFilter<"Loan"> | number
    purpose?: StringNullableFilter<"Loan"> | string | null
    status?: StringFilter<"Loan"> | string
    dueDate?: DateTimeNullableFilter<"Loan"> | Date | string | null
    disbursedAt?: DateTimeNullableFilter<"Loan"> | Date | string | null
    amountRepaid?: FloatFilter<"Loan"> | number
    repaidAt?: DateTimeNullableFilter<"Loan"> | Date | string | null
    createdAt?: DateTimeFilter<"Loan"> | Date | string
    updatedAt?: DateTimeFilter<"Loan"> | Date | string
  }

  export type LoanOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    disbursedAt?: SortOrder
    amountRepaid?: SortOrder
    repaidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoanWhereInput | LoanWhereInput[]
    OR?: LoanWhereInput[]
    NOT?: LoanWhereInput | LoanWhereInput[]
    userId?: StringFilter<"Loan"> | string
    amount?: FloatFilter<"Loan"> | number
    purpose?: StringNullableFilter<"Loan"> | string | null
    status?: StringFilter<"Loan"> | string
    dueDate?: DateTimeNullableFilter<"Loan"> | Date | string | null
    disbursedAt?: DateTimeNullableFilter<"Loan"> | Date | string | null
    amountRepaid?: FloatFilter<"Loan"> | number
    repaidAt?: DateTimeNullableFilter<"Loan"> | Date | string | null
    createdAt?: DateTimeFilter<"Loan"> | Date | string
    updatedAt?: DateTimeFilter<"Loan"> | Date | string
  }, "id">

  export type LoanOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    disbursedAt?: SortOrder
    amountRepaid?: SortOrder
    repaidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoanCountOrderByAggregateInput
    _avg?: LoanAvgOrderByAggregateInput
    _max?: LoanMaxOrderByAggregateInput
    _min?: LoanMinOrderByAggregateInput
    _sum?: LoanSumOrderByAggregateInput
  }

  export type LoanScalarWhereWithAggregatesInput = {
    AND?: LoanScalarWhereWithAggregatesInput | LoanScalarWhereWithAggregatesInput[]
    OR?: LoanScalarWhereWithAggregatesInput[]
    NOT?: LoanScalarWhereWithAggregatesInput | LoanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Loan"> | string
    userId?: StringWithAggregatesFilter<"Loan"> | string
    amount?: FloatWithAggregatesFilter<"Loan"> | number
    purpose?: StringNullableWithAggregatesFilter<"Loan"> | string | null
    status?: StringWithAggregatesFilter<"Loan"> | string
    dueDate?: DateTimeNullableWithAggregatesFilter<"Loan"> | Date | string | null
    disbursedAt?: DateTimeNullableWithAggregatesFilter<"Loan"> | Date | string | null
    amountRepaid?: FloatWithAggregatesFilter<"Loan"> | number
    repaidAt?: DateTimeNullableWithAggregatesFilter<"Loan"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Loan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Loan"> | Date | string
  }

  export type ProviderWhereInput = {
    AND?: ProviderWhereInput | ProviderWhereInput[]
    OR?: ProviderWhereInput[]
    NOT?: ProviderWhereInput | ProviderWhereInput[]
    id?: StringFilter<"Provider"> | string
    providerNumber?: StringFilter<"Provider"> | string
    name?: StringFilter<"Provider"> | string
    email?: StringNullableFilter<"Provider"> | string | null
    agreedAmount?: FloatNullableFilter<"Provider"> | number | null
    percentageToAdd?: FloatFilter<"Provider"> | number
    agreedAt?: DateTimeNullableFilter<"Provider"> | Date | string | null
    agreedTerms?: StringNullableFilter<"Provider"> | string | null
    createdAt?: DateTimeFilter<"Provider"> | Date | string
    updatedAt?: DateTimeFilter<"Provider"> | Date | string
    loanFundings?: LoanFundingListRelationFilter
  }

  export type ProviderOrderByWithRelationInput = {
    id?: SortOrder
    providerNumber?: SortOrder
    name?: SortOrder
    email?: SortOrder
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
    agreedAt?: SortOrder
    agreedTerms?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    loanFundings?: LoanFundingOrderByRelationAggregateInput
  }

  export type ProviderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    providerNumber?: string
    AND?: ProviderWhereInput | ProviderWhereInput[]
    OR?: ProviderWhereInput[]
    NOT?: ProviderWhereInput | ProviderWhereInput[]
    name?: StringFilter<"Provider"> | string
    email?: StringNullableFilter<"Provider"> | string | null
    agreedAmount?: FloatNullableFilter<"Provider"> | number | null
    percentageToAdd?: FloatFilter<"Provider"> | number
    agreedAt?: DateTimeNullableFilter<"Provider"> | Date | string | null
    agreedTerms?: StringNullableFilter<"Provider"> | string | null
    createdAt?: DateTimeFilter<"Provider"> | Date | string
    updatedAt?: DateTimeFilter<"Provider"> | Date | string
    loanFundings?: LoanFundingListRelationFilter
  }, "id" | "providerNumber">

  export type ProviderOrderByWithAggregationInput = {
    id?: SortOrder
    providerNumber?: SortOrder
    name?: SortOrder
    email?: SortOrder
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
    agreedAt?: SortOrder
    agreedTerms?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProviderCountOrderByAggregateInput
    _avg?: ProviderAvgOrderByAggregateInput
    _max?: ProviderMaxOrderByAggregateInput
    _min?: ProviderMinOrderByAggregateInput
    _sum?: ProviderSumOrderByAggregateInput
  }

  export type ProviderScalarWhereWithAggregatesInput = {
    AND?: ProviderScalarWhereWithAggregatesInput | ProviderScalarWhereWithAggregatesInput[]
    OR?: ProviderScalarWhereWithAggregatesInput[]
    NOT?: ProviderScalarWhereWithAggregatesInput | ProviderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Provider"> | string
    providerNumber?: StringWithAggregatesFilter<"Provider"> | string
    name?: StringWithAggregatesFilter<"Provider"> | string
    email?: StringNullableWithAggregatesFilter<"Provider"> | string | null
    agreedAmount?: FloatNullableWithAggregatesFilter<"Provider"> | number | null
    percentageToAdd?: FloatWithAggregatesFilter<"Provider"> | number
    agreedAt?: DateTimeNullableWithAggregatesFilter<"Provider"> | Date | string | null
    agreedTerms?: StringNullableWithAggregatesFilter<"Provider"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Provider"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Provider"> | Date | string
  }

  export type ProviderWalletWhereInput = {
    AND?: ProviderWalletWhereInput | ProviderWalletWhereInput[]
    OR?: ProviderWalletWhereInput[]
    NOT?: ProviderWalletWhereInput | ProviderWalletWhereInput[]
    id?: StringFilter<"ProviderWallet"> | string
    providerId?: StringFilter<"ProviderWallet"> | string
    balance?: FloatFilter<"ProviderWallet"> | number
    totalFunded?: FloatFilter<"ProviderWallet"> | number
    currency?: StringFilter<"ProviderWallet"> | string
    createdAt?: DateTimeFilter<"ProviderWallet"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderWallet"> | Date | string
  }

  export type ProviderWalletOrderByWithRelationInput = {
    id?: SortOrder
    providerId?: SortOrder
    balance?: SortOrder
    totalFunded?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderWalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    providerId?: string
    AND?: ProviderWalletWhereInput | ProviderWalletWhereInput[]
    OR?: ProviderWalletWhereInput[]
    NOT?: ProviderWalletWhereInput | ProviderWalletWhereInput[]
    balance?: FloatFilter<"ProviderWallet"> | number
    totalFunded?: FloatFilter<"ProviderWallet"> | number
    currency?: StringFilter<"ProviderWallet"> | string
    createdAt?: DateTimeFilter<"ProviderWallet"> | Date | string
    updatedAt?: DateTimeFilter<"ProviderWallet"> | Date | string
  }, "id" | "providerId">

  export type ProviderWalletOrderByWithAggregationInput = {
    id?: SortOrder
    providerId?: SortOrder
    balance?: SortOrder
    totalFunded?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProviderWalletCountOrderByAggregateInput
    _avg?: ProviderWalletAvgOrderByAggregateInput
    _max?: ProviderWalletMaxOrderByAggregateInput
    _min?: ProviderWalletMinOrderByAggregateInput
    _sum?: ProviderWalletSumOrderByAggregateInput
  }

  export type ProviderWalletScalarWhereWithAggregatesInput = {
    AND?: ProviderWalletScalarWhereWithAggregatesInput | ProviderWalletScalarWhereWithAggregatesInput[]
    OR?: ProviderWalletScalarWhereWithAggregatesInput[]
    NOT?: ProviderWalletScalarWhereWithAggregatesInput | ProviderWalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProviderWallet"> | string
    providerId?: StringWithAggregatesFilter<"ProviderWallet"> | string
    balance?: FloatWithAggregatesFilter<"ProviderWallet"> | number
    totalFunded?: FloatWithAggregatesFilter<"ProviderWallet"> | number
    currency?: StringWithAggregatesFilter<"ProviderWallet"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProviderWallet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProviderWallet"> | Date | string
  }

  export type LoanFundingWhereInput = {
    AND?: LoanFundingWhereInput | LoanFundingWhereInput[]
    OR?: LoanFundingWhereInput[]
    NOT?: LoanFundingWhereInput | LoanFundingWhereInput[]
    id?: StringFilter<"LoanFunding"> | string
    providerId?: StringFilter<"LoanFunding"> | string
    loanId?: StringFilter<"LoanFunding"> | string
    amount?: FloatFilter<"LoanFunding"> | number
    createdAt?: DateTimeFilter<"LoanFunding"> | Date | string
    provider?: XOR<ProviderScalarRelationFilter, ProviderWhereInput>
  }

  export type LoanFundingOrderByWithRelationInput = {
    id?: SortOrder
    providerId?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    provider?: ProviderOrderByWithRelationInput
  }

  export type LoanFundingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoanFundingWhereInput | LoanFundingWhereInput[]
    OR?: LoanFundingWhereInput[]
    NOT?: LoanFundingWhereInput | LoanFundingWhereInput[]
    providerId?: StringFilter<"LoanFunding"> | string
    loanId?: StringFilter<"LoanFunding"> | string
    amount?: FloatFilter<"LoanFunding"> | number
    createdAt?: DateTimeFilter<"LoanFunding"> | Date | string
    provider?: XOR<ProviderScalarRelationFilter, ProviderWhereInput>
  }, "id">

  export type LoanFundingOrderByWithAggregationInput = {
    id?: SortOrder
    providerId?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    _count?: LoanFundingCountOrderByAggregateInput
    _avg?: LoanFundingAvgOrderByAggregateInput
    _max?: LoanFundingMaxOrderByAggregateInput
    _min?: LoanFundingMinOrderByAggregateInput
    _sum?: LoanFundingSumOrderByAggregateInput
  }

  export type LoanFundingScalarWhereWithAggregatesInput = {
    AND?: LoanFundingScalarWhereWithAggregatesInput | LoanFundingScalarWhereWithAggregatesInput[]
    OR?: LoanFundingScalarWhereWithAggregatesInput[]
    NOT?: LoanFundingScalarWhereWithAggregatesInput | LoanFundingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoanFunding"> | string
    providerId?: StringWithAggregatesFilter<"LoanFunding"> | string
    loanId?: StringWithAggregatesFilter<"LoanFunding"> | string
    amount?: FloatWithAggregatesFilter<"LoanFunding"> | number
    createdAt?: DateTimeWithAggregatesFilter<"LoanFunding"> | Date | string
  }

  export type ProviderCreditWhereInput = {
    AND?: ProviderCreditWhereInput | ProviderCreditWhereInput[]
    OR?: ProviderCreditWhereInput[]
    NOT?: ProviderCreditWhereInput | ProviderCreditWhereInput[]
    id?: StringFilter<"ProviderCredit"> | string
    providerId?: StringFilter<"ProviderCredit"> | string
    amount?: FloatFilter<"ProviderCredit"> | number
    loanId?: StringNullableFilter<"ProviderCredit"> | string | null
    createdAt?: DateTimeFilter<"ProviderCredit"> | Date | string
  }

  export type ProviderCreditOrderByWithRelationInput = {
    id?: SortOrder
    providerId?: SortOrder
    amount?: SortOrder
    loanId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProviderCreditWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProviderCreditWhereInput | ProviderCreditWhereInput[]
    OR?: ProviderCreditWhereInput[]
    NOT?: ProviderCreditWhereInput | ProviderCreditWhereInput[]
    providerId?: StringFilter<"ProviderCredit"> | string
    amount?: FloatFilter<"ProviderCredit"> | number
    loanId?: StringNullableFilter<"ProviderCredit"> | string | null
    createdAt?: DateTimeFilter<"ProviderCredit"> | Date | string
  }, "id">

  export type ProviderCreditOrderByWithAggregationInput = {
    id?: SortOrder
    providerId?: SortOrder
    amount?: SortOrder
    loanId?: SortOrder
    createdAt?: SortOrder
    _count?: ProviderCreditCountOrderByAggregateInput
    _avg?: ProviderCreditAvgOrderByAggregateInput
    _max?: ProviderCreditMaxOrderByAggregateInput
    _min?: ProviderCreditMinOrderByAggregateInput
    _sum?: ProviderCreditSumOrderByAggregateInput
  }

  export type ProviderCreditScalarWhereWithAggregatesInput = {
    AND?: ProviderCreditScalarWhereWithAggregatesInput | ProviderCreditScalarWhereWithAggregatesInput[]
    OR?: ProviderCreditScalarWhereWithAggregatesInput[]
    NOT?: ProviderCreditScalarWhereWithAggregatesInput | ProviderCreditScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProviderCredit"> | string
    providerId?: StringWithAggregatesFilter<"ProviderCredit"> | string
    amount?: FloatWithAggregatesFilter<"ProviderCredit"> | number
    loanId?: StringNullableWithAggregatesFilter<"ProviderCredit"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProviderCredit"> | Date | string
  }

  export type EmployeeWhereInput = {
    AND?: EmployeeWhereInput | EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]
    NOT?: EmployeeWhereInput | EmployeeWhereInput[]
    id?: StringFilter<"Employee"> | string
    employeeNumber?: StringFilter<"Employee"> | string
    email?: StringFilter<"Employee"> | string
    password?: StringFilter<"Employee"> | string
    firstName?: StringFilter<"Employee"> | string
    lastName?: StringFilter<"Employee"> | string
    role?: StringFilter<"Employee"> | string
    active?: BoolFilter<"Employee"> | boolean
    createdAt?: DateTimeFilter<"Employee"> | Date | string
    updatedAt?: DateTimeFilter<"Employee"> | Date | string
  }

  export type EmployeeOrderByWithRelationInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmployeeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    employeeNumber?: string
    email?: string
    AND?: EmployeeWhereInput | EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]
    NOT?: EmployeeWhereInput | EmployeeWhereInput[]
    password?: StringFilter<"Employee"> | string
    firstName?: StringFilter<"Employee"> | string
    lastName?: StringFilter<"Employee"> | string
    role?: StringFilter<"Employee"> | string
    active?: BoolFilter<"Employee"> | boolean
    createdAt?: DateTimeFilter<"Employee"> | Date | string
    updatedAt?: DateTimeFilter<"Employee"> | Date | string
  }, "id" | "employeeNumber" | "email">

  export type EmployeeOrderByWithAggregationInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EmployeeCountOrderByAggregateInput
    _max?: EmployeeMaxOrderByAggregateInput
    _min?: EmployeeMinOrderByAggregateInput
  }

  export type EmployeeScalarWhereWithAggregatesInput = {
    AND?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[]
    OR?: EmployeeScalarWhereWithAggregatesInput[]
    NOT?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Employee"> | string
    employeeNumber?: StringWithAggregatesFilter<"Employee"> | string
    email?: StringWithAggregatesFilter<"Employee"> | string
    password?: StringWithAggregatesFilter<"Employee"> | string
    firstName?: StringWithAggregatesFilter<"Employee"> | string
    lastName?: StringWithAggregatesFilter<"Employee"> | string
    role?: StringWithAggregatesFilter<"Employee"> | string
    active?: BoolWithAggregatesFilter<"Employee"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Employee"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Employee"> | Date | string
  }

  export type AdminActivityWhereInput = {
    AND?: AdminActivityWhereInput | AdminActivityWhereInput[]
    OR?: AdminActivityWhereInput[]
    NOT?: AdminActivityWhereInput | AdminActivityWhereInput[]
    id?: StringFilter<"AdminActivity"> | string
    userId?: StringFilter<"AdminActivity"> | string
    action?: StringFilter<"AdminActivity"> | string
    ip?: StringNullableFilter<"AdminActivity"> | string | null
    createdAt?: DateTimeFilter<"AdminActivity"> | Date | string
  }

  export type AdminActivityOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminActivityWhereInput | AdminActivityWhereInput[]
    OR?: AdminActivityWhereInput[]
    NOT?: AdminActivityWhereInput | AdminActivityWhereInput[]
    userId?: StringFilter<"AdminActivity"> | string
    action?: StringFilter<"AdminActivity"> | string
    ip?: StringNullableFilter<"AdminActivity"> | string | null
    createdAt?: DateTimeFilter<"AdminActivity"> | Date | string
  }, "id">

  export type AdminActivityOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
    _count?: AdminActivityCountOrderByAggregateInput
    _max?: AdminActivityMaxOrderByAggregateInput
    _min?: AdminActivityMinOrderByAggregateInput
  }

  export type AdminActivityScalarWhereWithAggregatesInput = {
    AND?: AdminActivityScalarWhereWithAggregatesInput | AdminActivityScalarWhereWithAggregatesInput[]
    OR?: AdminActivityScalarWhereWithAggregatesInput[]
    NOT?: AdminActivityScalarWhereWithAggregatesInput | AdminActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminActivity"> | string
    userId?: StringWithAggregatesFilter<"AdminActivity"> | string
    action?: StringWithAggregatesFilter<"AdminActivity"> | string
    ip?: StringNullableWithAggregatesFilter<"AdminActivity"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AdminActivity"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    userNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    nin: string
    picture?: string | null
    role?: string
    verified?: boolean
    suspended?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    userNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    nin: string
    picture?: string | null
    role?: string
    verified?: boolean
    suspended?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    userNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    suspended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    userNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    suspended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    userNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    nin: string
    picture?: string | null
    role?: string
    verified?: boolean
    suspended?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    userNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    suspended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    userNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    suspended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeCreateInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type LoginCodeUncheckedCreateInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type LoginCodeUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeCreateManyInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type LoginCodeUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginCodeUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeCreateInput = {
    id?: string
    email: string
    token: string
    code: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetCodeUncheckedCreateInput = {
    id?: string
    email: string
    token: string
    code: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetCodeUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeCreateManyInput = {
    id?: string
    email: string
    token: string
    code: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type PasswordResetCodeUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationCreateInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    passwordHash: string
    firstName: string
    lastName: string
    nin: string
    picture?: string | null
    createdAt?: Date | string
  }

  export type PendingRegistrationUncheckedCreateInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    passwordHash: string
    firstName: string
    lastName: string
    nin: string
    picture?: string | null
    createdAt?: Date | string
  }

  export type PendingRegistrationUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationCreateManyInput = {
    id?: string
    email: string
    code: string
    expiresAt: Date | string
    passwordHash: string
    firstName: string
    lastName: string
    nin: string
    picture?: string | null
    createdAt?: Date | string
  }

  export type PendingRegistrationUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PendingRegistrationUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    nin?: StringFieldUpdateOperationsInput | string
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletCreateInput = {
    id?: string
    userId: string
    balance?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletUncheckedCreateInput = {
    id?: string
    userId: string
    balance?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletCreateManyInput = {
    id?: string
    userId: string
    balance?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WalletUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanCreateInput = {
    id?: string
    userId: string
    amount: number
    purpose?: string | null
    status: string
    dueDate?: Date | string | null
    disbursedAt?: Date | string | null
    amountRepaid?: number
    repaidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanUncheckedCreateInput = {
    id?: string
    userId: string
    amount: number
    purpose?: string | null
    status: string
    dueDate?: Date | string | null
    disbursedAt?: Date | string | null
    amountRepaid?: number
    repaidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disbursedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountRepaid?: FloatFieldUpdateOperationsInput | number
    repaidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disbursedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountRepaid?: FloatFieldUpdateOperationsInput | number
    repaidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanCreateManyInput = {
    id?: string
    userId: string
    amount: number
    purpose?: string | null
    status: string
    dueDate?: Date | string | null
    disbursedAt?: Date | string | null
    amountRepaid?: number
    repaidAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoanUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disbursedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountRepaid?: FloatFieldUpdateOperationsInput | number
    repaidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    disbursedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amountRepaid?: FloatFieldUpdateOperationsInput | number
    repaidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCreateInput = {
    id?: string
    providerNumber: string
    name: string
    email?: string | null
    agreedAmount?: number | null
    percentageToAdd?: number
    agreedAt?: Date | string | null
    agreedTerms?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    loanFundings?: LoanFundingCreateNestedManyWithoutProviderInput
  }

  export type ProviderUncheckedCreateInput = {
    id?: string
    providerNumber: string
    name: string
    email?: string | null
    agreedAmount?: number | null
    percentageToAdd?: number
    agreedAt?: Date | string | null
    agreedTerms?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    loanFundings?: LoanFundingUncheckedCreateNestedManyWithoutProviderInput
  }

  export type ProviderUpdateInput = {
    providerNumber?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    agreedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    percentageToAdd?: FloatFieldUpdateOperationsInput | number
    agreedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreedTerms?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loanFundings?: LoanFundingUpdateManyWithoutProviderNestedInput
  }

  export type ProviderUncheckedUpdateInput = {
    providerNumber?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    agreedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    percentageToAdd?: FloatFieldUpdateOperationsInput | number
    agreedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreedTerms?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loanFundings?: LoanFundingUncheckedUpdateManyWithoutProviderNestedInput
  }

  export type ProviderCreateManyInput = {
    id?: string
    providerNumber: string
    name: string
    email?: string | null
    agreedAmount?: number | null
    percentageToAdd?: number
    agreedAt?: Date | string | null
    agreedTerms?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderUpdateManyMutationInput = {
    providerNumber?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    agreedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    percentageToAdd?: FloatFieldUpdateOperationsInput | number
    agreedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreedTerms?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderUncheckedUpdateManyInput = {
    providerNumber?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    agreedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    percentageToAdd?: FloatFieldUpdateOperationsInput | number
    agreedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreedTerms?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderWalletCreateInput = {
    id?: string
    providerId: string
    balance?: number
    totalFunded?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderWalletUncheckedCreateInput = {
    id?: string
    providerId: string
    balance?: number
    totalFunded?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderWalletUpdateInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    totalFunded?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderWalletUncheckedUpdateInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    totalFunded?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderWalletCreateManyInput = {
    id?: string
    providerId: string
    balance?: number
    totalFunded?: number
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderWalletUpdateManyMutationInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    totalFunded?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderWalletUncheckedUpdateManyInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    totalFunded?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFundingCreateInput = {
    id?: string
    loanId: string
    amount: number
    createdAt?: Date | string
    provider: ProviderCreateNestedOneWithoutLoanFundingsInput
  }

  export type LoanFundingUncheckedCreateInput = {
    id?: string
    providerId: string
    loanId: string
    amount: number
    createdAt?: Date | string
  }

  export type LoanFundingUpdateInput = {
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    provider?: ProviderUpdateOneRequiredWithoutLoanFundingsNestedInput
  }

  export type LoanFundingUncheckedUpdateInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFundingCreateManyInput = {
    id?: string
    providerId: string
    loanId: string
    amount: number
    createdAt?: Date | string
  }

  export type LoanFundingUpdateManyMutationInput = {
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFundingUncheckedUpdateManyInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCreditCreateInput = {
    id?: string
    providerId: string
    amount: number
    loanId?: string | null
    createdAt?: Date | string
  }

  export type ProviderCreditUncheckedCreateInput = {
    id?: string
    providerId: string
    amount: number
    loanId?: string | null
    createdAt?: Date | string
  }

  export type ProviderCreditUpdateInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    loanId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCreditUncheckedUpdateInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    loanId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCreditCreateManyInput = {
    id?: string
    providerId: string
    amount: number
    loanId?: string | null
    createdAt?: Date | string
  }

  export type ProviderCreditUpdateManyMutationInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    loanId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCreditUncheckedUpdateManyInput = {
    providerId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    loanId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateInput = {
    id?: string
    employeeNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmployeeUncheckedCreateInput = {
    id?: string
    employeeNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmployeeUpdateInput = {
    employeeNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeUncheckedUpdateInput = {
    employeeNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateManyInput = {
    id?: string
    employeeNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmployeeUpdateManyMutationInput = {
    employeeNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeUncheckedUpdateManyInput = {
    employeeNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActivityCreateInput = {
    id?: string
    userId: string
    action: string
    ip?: string | null
    createdAt?: Date | string
  }

  export type AdminActivityUncheckedCreateInput = {
    id?: string
    userId: string
    action: string
    ip?: string | null
    createdAt?: Date | string
  }

  export type AdminActivityUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActivityUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActivityCreateManyInput = {
    id?: string
    userId: string
    action: string
    ip?: string | null
    createdAt?: Date | string
  }

  export type AdminActivityUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActivityUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    userNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    role?: SortOrder
    verified?: SortOrder
    suspended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    userNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    role?: SortOrder
    verified?: SortOrder
    suspended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    userNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    role?: SortOrder
    verified?: SortOrder
    suspended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type LoginCodeCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginCodeMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    token?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingRegistrationCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingRegistrationMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    createdAt?: SortOrder
  }

  export type PendingRegistrationMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    code?: SortOrder
    expiresAt?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    nin?: SortOrder
    picture?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type WalletCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type WalletMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    balance?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WalletSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type LoanCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    disbursedAt?: SortOrder
    amountRepaid?: SortOrder
    repaidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanAvgOrderByAggregateInput = {
    amount?: SortOrder
    amountRepaid?: SortOrder
  }

  export type LoanMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    disbursedAt?: SortOrder
    amountRepaid?: SortOrder
    repaidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    status?: SortOrder
    dueDate?: SortOrder
    disbursedAt?: SortOrder
    amountRepaid?: SortOrder
    repaidAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoanSumOrderByAggregateInput = {
    amount?: SortOrder
    amountRepaid?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type LoanFundingListRelationFilter = {
    every?: LoanFundingWhereInput
    some?: LoanFundingWhereInput
    none?: LoanFundingWhereInput
  }

  export type LoanFundingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProviderCountOrderByAggregateInput = {
    id?: SortOrder
    providerNumber?: SortOrder
    name?: SortOrder
    email?: SortOrder
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
    agreedAt?: SortOrder
    agreedTerms?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderAvgOrderByAggregateInput = {
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
  }

  export type ProviderMaxOrderByAggregateInput = {
    id?: SortOrder
    providerNumber?: SortOrder
    name?: SortOrder
    email?: SortOrder
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
    agreedAt?: SortOrder
    agreedTerms?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderMinOrderByAggregateInput = {
    id?: SortOrder
    providerNumber?: SortOrder
    name?: SortOrder
    email?: SortOrder
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
    agreedAt?: SortOrder
    agreedTerms?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderSumOrderByAggregateInput = {
    agreedAmount?: SortOrder
    percentageToAdd?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type ProviderWalletCountOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    balance?: SortOrder
    totalFunded?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderWalletAvgOrderByAggregateInput = {
    balance?: SortOrder
    totalFunded?: SortOrder
  }

  export type ProviderWalletMaxOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    balance?: SortOrder
    totalFunded?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderWalletMinOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    balance?: SortOrder
    totalFunded?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProviderWalletSumOrderByAggregateInput = {
    balance?: SortOrder
    totalFunded?: SortOrder
  }

  export type ProviderScalarRelationFilter = {
    is?: ProviderWhereInput
    isNot?: ProviderWhereInput
  }

  export type LoanFundingCountOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanFundingAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LoanFundingMaxOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanFundingMinOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    loanId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type LoanFundingSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ProviderCreditCountOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    amount?: SortOrder
    loanId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProviderCreditAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ProviderCreditMaxOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    amount?: SortOrder
    loanId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProviderCreditMinOrderByAggregateInput = {
    id?: SortOrder
    providerId?: SortOrder
    amount?: SortOrder
    loanId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProviderCreditSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EmployeeCountOrderByAggregateInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmployeeMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmployeeMinOrderByAggregateInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    email?: SortOrder
    password?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminActivityCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminActivityMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    ip?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type LoanFundingCreateNestedManyWithoutProviderInput = {
    create?: XOR<LoanFundingCreateWithoutProviderInput, LoanFundingUncheckedCreateWithoutProviderInput> | LoanFundingCreateWithoutProviderInput[] | LoanFundingUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: LoanFundingCreateOrConnectWithoutProviderInput | LoanFundingCreateOrConnectWithoutProviderInput[]
    createMany?: LoanFundingCreateManyProviderInputEnvelope
    connect?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
  }

  export type LoanFundingUncheckedCreateNestedManyWithoutProviderInput = {
    create?: XOR<LoanFundingCreateWithoutProviderInput, LoanFundingUncheckedCreateWithoutProviderInput> | LoanFundingCreateWithoutProviderInput[] | LoanFundingUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: LoanFundingCreateOrConnectWithoutProviderInput | LoanFundingCreateOrConnectWithoutProviderInput[]
    createMany?: LoanFundingCreateManyProviderInputEnvelope
    connect?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type LoanFundingUpdateManyWithoutProviderNestedInput = {
    create?: XOR<LoanFundingCreateWithoutProviderInput, LoanFundingUncheckedCreateWithoutProviderInput> | LoanFundingCreateWithoutProviderInput[] | LoanFundingUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: LoanFundingCreateOrConnectWithoutProviderInput | LoanFundingCreateOrConnectWithoutProviderInput[]
    upsert?: LoanFundingUpsertWithWhereUniqueWithoutProviderInput | LoanFundingUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: LoanFundingCreateManyProviderInputEnvelope
    set?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    disconnect?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    delete?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    connect?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    update?: LoanFundingUpdateWithWhereUniqueWithoutProviderInput | LoanFundingUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: LoanFundingUpdateManyWithWhereWithoutProviderInput | LoanFundingUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: LoanFundingScalarWhereInput | LoanFundingScalarWhereInput[]
  }

  export type LoanFundingUncheckedUpdateManyWithoutProviderNestedInput = {
    create?: XOR<LoanFundingCreateWithoutProviderInput, LoanFundingUncheckedCreateWithoutProviderInput> | LoanFundingCreateWithoutProviderInput[] | LoanFundingUncheckedCreateWithoutProviderInput[]
    connectOrCreate?: LoanFundingCreateOrConnectWithoutProviderInput | LoanFundingCreateOrConnectWithoutProviderInput[]
    upsert?: LoanFundingUpsertWithWhereUniqueWithoutProviderInput | LoanFundingUpsertWithWhereUniqueWithoutProviderInput[]
    createMany?: LoanFundingCreateManyProviderInputEnvelope
    set?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    disconnect?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    delete?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    connect?: LoanFundingWhereUniqueInput | LoanFundingWhereUniqueInput[]
    update?: LoanFundingUpdateWithWhereUniqueWithoutProviderInput | LoanFundingUpdateWithWhereUniqueWithoutProviderInput[]
    updateMany?: LoanFundingUpdateManyWithWhereWithoutProviderInput | LoanFundingUpdateManyWithWhereWithoutProviderInput[]
    deleteMany?: LoanFundingScalarWhereInput | LoanFundingScalarWhereInput[]
  }

  export type ProviderCreateNestedOneWithoutLoanFundingsInput = {
    create?: XOR<ProviderCreateWithoutLoanFundingsInput, ProviderUncheckedCreateWithoutLoanFundingsInput>
    connectOrCreate?: ProviderCreateOrConnectWithoutLoanFundingsInput
    connect?: ProviderWhereUniqueInput
  }

  export type ProviderUpdateOneRequiredWithoutLoanFundingsNestedInput = {
    create?: XOR<ProviderCreateWithoutLoanFundingsInput, ProviderUncheckedCreateWithoutLoanFundingsInput>
    connectOrCreate?: ProviderCreateOrConnectWithoutLoanFundingsInput
    upsert?: ProviderUpsertWithoutLoanFundingsInput
    connect?: ProviderWhereUniqueInput
    update?: XOR<XOR<ProviderUpdateToOneWithWhereWithoutLoanFundingsInput, ProviderUpdateWithoutLoanFundingsInput>, ProviderUncheckedUpdateWithoutLoanFundingsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type LoanFundingCreateWithoutProviderInput = {
    id?: string
    loanId: string
    amount: number
    createdAt?: Date | string
  }

  export type LoanFundingUncheckedCreateWithoutProviderInput = {
    id?: string
    loanId: string
    amount: number
    createdAt?: Date | string
  }

  export type LoanFundingCreateOrConnectWithoutProviderInput = {
    where: LoanFundingWhereUniqueInput
    create: XOR<LoanFundingCreateWithoutProviderInput, LoanFundingUncheckedCreateWithoutProviderInput>
  }

  export type LoanFundingCreateManyProviderInputEnvelope = {
    data: LoanFundingCreateManyProviderInput | LoanFundingCreateManyProviderInput[]
  }

  export type LoanFundingUpsertWithWhereUniqueWithoutProviderInput = {
    where: LoanFundingWhereUniqueInput
    update: XOR<LoanFundingUpdateWithoutProviderInput, LoanFundingUncheckedUpdateWithoutProviderInput>
    create: XOR<LoanFundingCreateWithoutProviderInput, LoanFundingUncheckedCreateWithoutProviderInput>
  }

  export type LoanFundingUpdateWithWhereUniqueWithoutProviderInput = {
    where: LoanFundingWhereUniqueInput
    data: XOR<LoanFundingUpdateWithoutProviderInput, LoanFundingUncheckedUpdateWithoutProviderInput>
  }

  export type LoanFundingUpdateManyWithWhereWithoutProviderInput = {
    where: LoanFundingScalarWhereInput
    data: XOR<LoanFundingUpdateManyMutationInput, LoanFundingUncheckedUpdateManyWithoutProviderInput>
  }

  export type LoanFundingScalarWhereInput = {
    AND?: LoanFundingScalarWhereInput | LoanFundingScalarWhereInput[]
    OR?: LoanFundingScalarWhereInput[]
    NOT?: LoanFundingScalarWhereInput | LoanFundingScalarWhereInput[]
    id?: StringFilter<"LoanFunding"> | string
    providerId?: StringFilter<"LoanFunding"> | string
    loanId?: StringFilter<"LoanFunding"> | string
    amount?: FloatFilter<"LoanFunding"> | number
    createdAt?: DateTimeFilter<"LoanFunding"> | Date | string
  }

  export type ProviderCreateWithoutLoanFundingsInput = {
    id?: string
    providerNumber: string
    name: string
    email?: string | null
    agreedAmount?: number | null
    percentageToAdd?: number
    agreedAt?: Date | string | null
    agreedTerms?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderUncheckedCreateWithoutLoanFundingsInput = {
    id?: string
    providerNumber: string
    name: string
    email?: string | null
    agreedAmount?: number | null
    percentageToAdd?: number
    agreedAt?: Date | string | null
    agreedTerms?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProviderCreateOrConnectWithoutLoanFundingsInput = {
    where: ProviderWhereUniqueInput
    create: XOR<ProviderCreateWithoutLoanFundingsInput, ProviderUncheckedCreateWithoutLoanFundingsInput>
  }

  export type ProviderUpsertWithoutLoanFundingsInput = {
    update: XOR<ProviderUpdateWithoutLoanFundingsInput, ProviderUncheckedUpdateWithoutLoanFundingsInput>
    create: XOR<ProviderCreateWithoutLoanFundingsInput, ProviderUncheckedCreateWithoutLoanFundingsInput>
    where?: ProviderWhereInput
  }

  export type ProviderUpdateToOneWithWhereWithoutLoanFundingsInput = {
    where?: ProviderWhereInput
    data: XOR<ProviderUpdateWithoutLoanFundingsInput, ProviderUncheckedUpdateWithoutLoanFundingsInput>
  }

  export type ProviderUpdateWithoutLoanFundingsInput = {
    providerNumber?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    agreedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    percentageToAdd?: FloatFieldUpdateOperationsInput | number
    agreedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreedTerms?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderUncheckedUpdateWithoutLoanFundingsInput = {
    providerNumber?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    agreedAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    percentageToAdd?: FloatFieldUpdateOperationsInput | number
    agreedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    agreedTerms?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFundingCreateManyProviderInput = {
    id?: string
    loanId: string
    amount: number
    createdAt?: Date | string
  }

  export type LoanFundingUpdateWithoutProviderInput = {
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFundingUncheckedUpdateWithoutProviderInput = {
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoanFundingUncheckedUpdateManyWithoutProviderInput = {
    loanId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}