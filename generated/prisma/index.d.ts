
/**
 * Client
**/

import * as runtime from './runtime/client.js';
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
 * Model Mission
 * 
 */
export type Mission = $Result.DefaultSelection<Prisma.$MissionPayload>
/**
 * Model Guild
 * 
 */
export type Guild = $Result.DefaultSelection<Prisma.$GuildPayload>
/**
 * Model GuildMember
 * 
 */
export type GuildMember = $Result.DefaultSelection<Prisma.$GuildMemberPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model QuizResult
 * 
 */
export type QuizResult = $Result.DefaultSelection<Prisma.$QuizResultPayload>
/**
 * Model MissionSubmission
 * 
 */
export type MissionSubmission = $Result.DefaultSelection<Prisma.$MissionSubmissionPayload>
/**
 * Model ContactMessage
 * 
 */
export type ContactMessage = $Result.DefaultSelection<Prisma.$ContactMessagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

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
   * `prisma.mission`: Exposes CRUD operations for the **Mission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Missions
    * const missions = await prisma.mission.findMany()
    * ```
    */
  get mission(): Prisma.MissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guild`: Exposes CRUD operations for the **Guild** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guilds
    * const guilds = await prisma.guild.findMany()
    * ```
    */
  get guild(): Prisma.GuildDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guildMember`: Exposes CRUD operations for the **GuildMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuildMembers
    * const guildMembers = await prisma.guildMember.findMany()
    * ```
    */
  get guildMember(): Prisma.GuildMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizResult`: Exposes CRUD operations for the **QuizResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizResults
    * const quizResults = await prisma.quizResult.findMany()
    * ```
    */
  get quizResult(): Prisma.QuizResultDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.missionSubmission`: Exposes CRUD operations for the **MissionSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MissionSubmissions
    * const missionSubmissions = await prisma.missionSubmission.findMany()
    * ```
    */
  get missionSubmission(): Prisma.MissionSubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.contactMessage`: Exposes CRUD operations for the **ContactMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContactMessages
    * const contactMessages = await prisma.contactMessage.findMany()
    * ```
    */
  get contactMessage(): Prisma.ContactMessageDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
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
    Mission: 'Mission',
    Guild: 'Guild',
    GuildMember: 'GuildMember',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    QuizResult: 'QuizResult',
    MissionSubmission: 'MissionSubmission',
    ContactMessage: 'ContactMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "mission" | "guild" | "guildMember" | "session" | "account" | "verification" | "quizResult" | "missionSubmission" | "contactMessage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
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
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
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
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
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
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Mission: {
        payload: Prisma.$MissionPayload<ExtArgs>
        fields: Prisma.MissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>
          }
          findFirst: {
            args: Prisma.MissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>
          }
          findMany: {
            args: Prisma.MissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>[]
          }
          create: {
            args: Prisma.MissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>
          }
          createMany: {
            args: Prisma.MissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>[]
          }
          delete: {
            args: Prisma.MissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>
          }
          update: {
            args: Prisma.MissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>
          }
          deleteMany: {
            args: Prisma.MissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>[]
          }
          upsert: {
            args: Prisma.MissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionPayload>
          }
          aggregate: {
            args: Prisma.MissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMission>
          }
          groupBy: {
            args: Prisma.MissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MissionCountArgs<ExtArgs>
            result: $Utils.Optional<MissionCountAggregateOutputType> | number
          }
        }
      }
      Guild: {
        payload: Prisma.$GuildPayload<ExtArgs>
        fields: Prisma.GuildFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          findFirst: {
            args: Prisma.GuildFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          findMany: {
            args: Prisma.GuildFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>[]
          }
          create: {
            args: Prisma.GuildCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          createMany: {
            args: Prisma.GuildCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>[]
          }
          delete: {
            args: Prisma.GuildDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          update: {
            args: Prisma.GuildUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          deleteMany: {
            args: Prisma.GuildDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>[]
          }
          upsert: {
            args: Prisma.GuildUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildPayload>
          }
          aggregate: {
            args: Prisma.GuildAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuild>
          }
          groupBy: {
            args: Prisma.GuildGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildCountArgs<ExtArgs>
            result: $Utils.Optional<GuildCountAggregateOutputType> | number
          }
        }
      }
      GuildMember: {
        payload: Prisma.$GuildMemberPayload<ExtArgs>
        fields: Prisma.GuildMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuildMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuildMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>
          }
          findFirst: {
            args: Prisma.GuildMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuildMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>
          }
          findMany: {
            args: Prisma.GuildMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>[]
          }
          create: {
            args: Prisma.GuildMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>
          }
          createMany: {
            args: Prisma.GuildMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuildMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>[]
          }
          delete: {
            args: Prisma.GuildMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>
          }
          update: {
            args: Prisma.GuildMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>
          }
          deleteMany: {
            args: Prisma.GuildMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuildMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuildMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>[]
          }
          upsert: {
            args: Prisma.GuildMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuildMemberPayload>
          }
          aggregate: {
            args: Prisma.GuildMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuildMember>
          }
          groupBy: {
            args: Prisma.GuildMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuildMemberCountArgs<ExtArgs>
            result: $Utils.Optional<GuildMemberCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      QuizResult: {
        payload: Prisma.$QuizResultPayload<ExtArgs>
        fields: Prisma.QuizResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>
          }
          findFirst: {
            args: Prisma.QuizResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>
          }
          findMany: {
            args: Prisma.QuizResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>[]
          }
          create: {
            args: Prisma.QuizResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>
          }
          createMany: {
            args: Prisma.QuizResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>[]
          }
          delete: {
            args: Prisma.QuizResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>
          }
          update: {
            args: Prisma.QuizResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>
          }
          deleteMany: {
            args: Prisma.QuizResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>[]
          }
          upsert: {
            args: Prisma.QuizResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizResultPayload>
          }
          aggregate: {
            args: Prisma.QuizResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizResult>
          }
          groupBy: {
            args: Prisma.QuizResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizResultCountArgs<ExtArgs>
            result: $Utils.Optional<QuizResultCountAggregateOutputType> | number
          }
        }
      }
      MissionSubmission: {
        payload: Prisma.$MissionSubmissionPayload<ExtArgs>
        fields: Prisma.MissionSubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MissionSubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MissionSubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>
          }
          findFirst: {
            args: Prisma.MissionSubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MissionSubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>
          }
          findMany: {
            args: Prisma.MissionSubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>[]
          }
          create: {
            args: Prisma.MissionSubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>
          }
          createMany: {
            args: Prisma.MissionSubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MissionSubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>[]
          }
          delete: {
            args: Prisma.MissionSubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>
          }
          update: {
            args: Prisma.MissionSubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>
          }
          deleteMany: {
            args: Prisma.MissionSubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MissionSubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MissionSubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>[]
          }
          upsert: {
            args: Prisma.MissionSubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionSubmissionPayload>
          }
          aggregate: {
            args: Prisma.MissionSubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMissionSubmission>
          }
          groupBy: {
            args: Prisma.MissionSubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MissionSubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MissionSubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<MissionSubmissionCountAggregateOutputType> | number
          }
        }
      }
      ContactMessage: {
        payload: Prisma.$ContactMessagePayload<ExtArgs>
        fields: Prisma.ContactMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContactMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContactMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          findFirst: {
            args: Prisma.ContactMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContactMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          findMany: {
            args: Prisma.ContactMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          create: {
            args: Prisma.ContactMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          createMany: {
            args: Prisma.ContactMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContactMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          delete: {
            args: Prisma.ContactMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          update: {
            args: Prisma.ContactMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          deleteMany: {
            args: Prisma.ContactMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContactMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContactMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>[]
          }
          upsert: {
            args: Prisma.ContactMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContactMessagePayload>
          }
          aggregate: {
            args: Prisma.ContactMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContactMessage>
          }
          groupBy: {
            args: Prisma.ContactMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContactMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContactMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ContactMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    mission?: MissionOmit
    guild?: GuildOmit
    guildMember?: GuildMemberOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    quizResult?: QuizResultOmit
    missionSubmission?: MissionSubmissionOmit
    contactMessage?: ContactMessageOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    mentees: number
    sessions: number
    accounts: number
    quizResults: number
    guildMembers: number
    missionSubmissions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentees?: boolean | UserCountOutputTypeCountMenteesArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    quizResults?: boolean | UserCountOutputTypeCountQuizResultsArgs
    guildMembers?: boolean | UserCountOutputTypeCountGuildMembersArgs
    missionSubmissions?: boolean | UserCountOutputTypeCountMissionSubmissionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMenteesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountQuizResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizResultWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGuildMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMissionSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MissionSubmissionWhereInput
  }


  /**
   * Count Type MissionCountOutputType
   */

  export type MissionCountOutputType = {
    submissions: number
  }

  export type MissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissions?: boolean | MissionCountOutputTypeCountSubmissionsArgs
  }

  // Custom InputTypes
  /**
   * MissionCountOutputType without action
   */
  export type MissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionCountOutputType
     */
    select?: MissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MissionCountOutputType without action
   */
  export type MissionCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MissionSubmissionWhereInput
  }


  /**
   * Count Type GuildCountOutputType
   */

  export type GuildCountOutputType = {
    members: number
  }

  export type GuildCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | GuildCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildCountOutputType
     */
    select?: GuildCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GuildCountOutputType without action
   */
  export type GuildCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildMemberWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    level: number | null
    experience: number | null
    onboardingSpeed: number | null
    answerConsistency: number | null
    connectionFrequency: number | null
    dashboardActivity: number | null
    communityEngagement: number | null
    builderScore: number | null
    creatorScore: number | null
    strategistScore: number | null
    catalystScore: number | null
    polarization: number | null
    profileStability: number | null
    missionsCompletedCount: number | null
    predictedEngagementScore: number | null
    confidenceScore: number | null
    profileDrift: number | null
  }

  export type UserSumAggregateOutputType = {
    level: number | null
    experience: number | null
    onboardingSpeed: number | null
    answerConsistency: number | null
    connectionFrequency: number | null
    dashboardActivity: number | null
    communityEngagement: number | null
    builderScore: number | null
    creatorScore: number | null
    strategistScore: number | null
    catalystScore: number | null
    polarization: number | null
    profileStability: number | null
    missionsCompletedCount: number | null
    predictedEngagementScore: number | null
    confidenceScore: number | null
    profileDrift: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    level: number | null
    experience: number | null
    class: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    pseudo: string | null
    bio: string | null
    country: string | null
    city: string | null
    language: string | null
    ageRange: string | null
    currentSituation: string | null
    technicalLevel: string | null
    githubUrl: string | null
    portfolioUrl: string | null
    linkedinUrl: string | null
    twitterUrl: string | null
    mainObjective: string | null
    dominantMotivation: string | null
    longTermObjective: string | null
    preferredRhythm: string | null
    onboardingSpeed: number | null
    answerConsistency: number | null
    connectionFrequency: number | null
    dashboardActivity: number | null
    communityEngagement: number | null
    builderScore: number | null
    creatorScore: number | null
    strategistScore: number | null
    catalystScore: number | null
    polarization: number | null
    profileStability: number | null
    mentorId: string | null
    missionsCompletedCount: number | null
    predictedEngagementScore: number | null
    confidenceScore: number | null
    profileDrift: number | null
    lastHypothesisUpdate: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    level: number | null
    experience: number | null
    class: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
    pseudo: string | null
    bio: string | null
    country: string | null
    city: string | null
    language: string | null
    ageRange: string | null
    currentSituation: string | null
    technicalLevel: string | null
    githubUrl: string | null
    portfolioUrl: string | null
    linkedinUrl: string | null
    twitterUrl: string | null
    mainObjective: string | null
    dominantMotivation: string | null
    longTermObjective: string | null
    preferredRhythm: string | null
    onboardingSpeed: number | null
    answerConsistency: number | null
    connectionFrequency: number | null
    dashboardActivity: number | null
    communityEngagement: number | null
    builderScore: number | null
    creatorScore: number | null
    strategistScore: number | null
    catalystScore: number | null
    polarization: number | null
    profileStability: number | null
    mentorId: string | null
    missionsCompletedCount: number | null
    predictedEngagementScore: number | null
    confidenceScore: number | null
    profileDrift: number | null
    lastHypothesisUpdate: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    level: number
    experience: number
    class: number
    role: number
    createdAt: number
    updatedAt: number
    pseudo: number
    bio: number
    country: number
    city: number
    language: number
    ageRange: number
    currentSituation: number
    technicalLevel: number
    domains: number
    tools: number
    githubUrl: number
    portfolioUrl: number
    linkedinUrl: number
    twitterUrl: number
    mainObjective: number
    secondaryObjectives: number
    dominantMotivation: number
    longTermObjective: number
    preferredRhythm: number
    onboardingSpeed: number
    answerConsistency: number
    connectionFrequency: number
    dashboardActivity: number
    communityEngagement: number
    builderScore: number
    creatorScore: number
    strategistScore: number
    catalystScore: number
    polarization: number
    profileStability: number
    cohortsJoined: number
    collaborativeProjects: number
    mentorId: number
    projectsRealized: number
    activePaths: number
    badges: number
    missionsCompletedCount: number
    recommendedPath: number
    recommendedTools: number
    predictedEngagementScore: number
    confidenceScore: number
    profileDrift: number
    behavioralVibrancy: number
    lastHypothesisUpdate: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    level?: true
    experience?: true
    onboardingSpeed?: true
    answerConsistency?: true
    connectionFrequency?: true
    dashboardActivity?: true
    communityEngagement?: true
    builderScore?: true
    creatorScore?: true
    strategistScore?: true
    catalystScore?: true
    polarization?: true
    profileStability?: true
    missionsCompletedCount?: true
    predictedEngagementScore?: true
    confidenceScore?: true
    profileDrift?: true
  }

  export type UserSumAggregateInputType = {
    level?: true
    experience?: true
    onboardingSpeed?: true
    answerConsistency?: true
    connectionFrequency?: true
    dashboardActivity?: true
    communityEngagement?: true
    builderScore?: true
    creatorScore?: true
    strategistScore?: true
    catalystScore?: true
    polarization?: true
    profileStability?: true
    missionsCompletedCount?: true
    predictedEngagementScore?: true
    confidenceScore?: true
    profileDrift?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    level?: true
    experience?: true
    class?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    pseudo?: true
    bio?: true
    country?: true
    city?: true
    language?: true
    ageRange?: true
    currentSituation?: true
    technicalLevel?: true
    githubUrl?: true
    portfolioUrl?: true
    linkedinUrl?: true
    twitterUrl?: true
    mainObjective?: true
    dominantMotivation?: true
    longTermObjective?: true
    preferredRhythm?: true
    onboardingSpeed?: true
    answerConsistency?: true
    connectionFrequency?: true
    dashboardActivity?: true
    communityEngagement?: true
    builderScore?: true
    creatorScore?: true
    strategistScore?: true
    catalystScore?: true
    polarization?: true
    profileStability?: true
    mentorId?: true
    missionsCompletedCount?: true
    predictedEngagementScore?: true
    confidenceScore?: true
    profileDrift?: true
    lastHypothesisUpdate?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    level?: true
    experience?: true
    class?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    pseudo?: true
    bio?: true
    country?: true
    city?: true
    language?: true
    ageRange?: true
    currentSituation?: true
    technicalLevel?: true
    githubUrl?: true
    portfolioUrl?: true
    linkedinUrl?: true
    twitterUrl?: true
    mainObjective?: true
    dominantMotivation?: true
    longTermObjective?: true
    preferredRhythm?: true
    onboardingSpeed?: true
    answerConsistency?: true
    connectionFrequency?: true
    dashboardActivity?: true
    communityEngagement?: true
    builderScore?: true
    creatorScore?: true
    strategistScore?: true
    catalystScore?: true
    polarization?: true
    profileStability?: true
    mentorId?: true
    missionsCompletedCount?: true
    predictedEngagementScore?: true
    confidenceScore?: true
    profileDrift?: true
    lastHypothesisUpdate?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    level?: true
    experience?: true
    class?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    pseudo?: true
    bio?: true
    country?: true
    city?: true
    language?: true
    ageRange?: true
    currentSituation?: true
    technicalLevel?: true
    domains?: true
    tools?: true
    githubUrl?: true
    portfolioUrl?: true
    linkedinUrl?: true
    twitterUrl?: true
    mainObjective?: true
    secondaryObjectives?: true
    dominantMotivation?: true
    longTermObjective?: true
    preferredRhythm?: true
    onboardingSpeed?: true
    answerConsistency?: true
    connectionFrequency?: true
    dashboardActivity?: true
    communityEngagement?: true
    builderScore?: true
    creatorScore?: true
    strategistScore?: true
    catalystScore?: true
    polarization?: true
    profileStability?: true
    cohortsJoined?: true
    collaborativeProjects?: true
    mentorId?: true
    projectsRealized?: true
    activePaths?: true
    badges?: true
    missionsCompletedCount?: true
    recommendedPath?: true
    recommendedTools?: true
    predictedEngagementScore?: true
    confidenceScore?: true
    profileDrift?: true
    behavioralVibrancy?: true
    lastHypothesisUpdate?: true
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
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
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
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    level: number
    experience: number
    class: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    pseudo: string | null
    bio: string | null
    country: string | null
    city: string | null
    language: string
    ageRange: string | null
    currentSituation: string | null
    technicalLevel: string | null
    domains: string[]
    tools: string[]
    githubUrl: string | null
    portfolioUrl: string | null
    linkedinUrl: string | null
    twitterUrl: string | null
    mainObjective: string | null
    secondaryObjectives: string[]
    dominantMotivation: string | null
    longTermObjective: string | null
    preferredRhythm: string | null
    onboardingSpeed: number | null
    answerConsistency: number | null
    connectionFrequency: number | null
    dashboardActivity: number | null
    communityEngagement: number | null
    builderScore: number
    creatorScore: number
    strategistScore: number
    catalystScore: number
    polarization: number
    profileStability: number
    cohortsJoined: string[]
    collaborativeProjects: string[]
    mentorId: string | null
    projectsRealized: string[]
    activePaths: string[]
    badges: string[]
    missionsCompletedCount: number
    recommendedPath: string[]
    recommendedTools: string[]
    predictedEngagementScore: number | null
    confidenceScore: number
    profileDrift: number
    behavioralVibrancy: JsonValue | null
    lastHypothesisUpdate: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
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
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    level?: boolean
    experience?: boolean
    class?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pseudo?: boolean
    bio?: boolean
    country?: boolean
    city?: boolean
    language?: boolean
    ageRange?: boolean
    currentSituation?: boolean
    technicalLevel?: boolean
    domains?: boolean
    tools?: boolean
    githubUrl?: boolean
    portfolioUrl?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    mainObjective?: boolean
    secondaryObjectives?: boolean
    dominantMotivation?: boolean
    longTermObjective?: boolean
    preferredRhythm?: boolean
    onboardingSpeed?: boolean
    answerConsistency?: boolean
    connectionFrequency?: boolean
    dashboardActivity?: boolean
    communityEngagement?: boolean
    builderScore?: boolean
    creatorScore?: boolean
    strategistScore?: boolean
    catalystScore?: boolean
    polarization?: boolean
    profileStability?: boolean
    cohortsJoined?: boolean
    collaborativeProjects?: boolean
    mentorId?: boolean
    projectsRealized?: boolean
    activePaths?: boolean
    badges?: boolean
    missionsCompletedCount?: boolean
    recommendedPath?: boolean
    recommendedTools?: boolean
    predictedEngagementScore?: boolean
    confidenceScore?: boolean
    profileDrift?: boolean
    behavioralVibrancy?: boolean
    lastHypothesisUpdate?: boolean
    mentor?: boolean | User$mentorArgs<ExtArgs>
    mentees?: boolean | User$menteesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    quizResults?: boolean | User$quizResultsArgs<ExtArgs>
    guildMembers?: boolean | User$guildMembersArgs<ExtArgs>
    missionSubmissions?: boolean | User$missionSubmissionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    level?: boolean
    experience?: boolean
    class?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pseudo?: boolean
    bio?: boolean
    country?: boolean
    city?: boolean
    language?: boolean
    ageRange?: boolean
    currentSituation?: boolean
    technicalLevel?: boolean
    domains?: boolean
    tools?: boolean
    githubUrl?: boolean
    portfolioUrl?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    mainObjective?: boolean
    secondaryObjectives?: boolean
    dominantMotivation?: boolean
    longTermObjective?: boolean
    preferredRhythm?: boolean
    onboardingSpeed?: boolean
    answerConsistency?: boolean
    connectionFrequency?: boolean
    dashboardActivity?: boolean
    communityEngagement?: boolean
    builderScore?: boolean
    creatorScore?: boolean
    strategistScore?: boolean
    catalystScore?: boolean
    polarization?: boolean
    profileStability?: boolean
    cohortsJoined?: boolean
    collaborativeProjects?: boolean
    mentorId?: boolean
    projectsRealized?: boolean
    activePaths?: boolean
    badges?: boolean
    missionsCompletedCount?: boolean
    recommendedPath?: boolean
    recommendedTools?: boolean
    predictedEngagementScore?: boolean
    confidenceScore?: boolean
    profileDrift?: boolean
    behavioralVibrancy?: boolean
    lastHypothesisUpdate?: boolean
    mentor?: boolean | User$mentorArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    level?: boolean
    experience?: boolean
    class?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pseudo?: boolean
    bio?: boolean
    country?: boolean
    city?: boolean
    language?: boolean
    ageRange?: boolean
    currentSituation?: boolean
    technicalLevel?: boolean
    domains?: boolean
    tools?: boolean
    githubUrl?: boolean
    portfolioUrl?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    mainObjective?: boolean
    secondaryObjectives?: boolean
    dominantMotivation?: boolean
    longTermObjective?: boolean
    preferredRhythm?: boolean
    onboardingSpeed?: boolean
    answerConsistency?: boolean
    connectionFrequency?: boolean
    dashboardActivity?: boolean
    communityEngagement?: boolean
    builderScore?: boolean
    creatorScore?: boolean
    strategistScore?: boolean
    catalystScore?: boolean
    polarization?: boolean
    profileStability?: boolean
    cohortsJoined?: boolean
    collaborativeProjects?: boolean
    mentorId?: boolean
    projectsRealized?: boolean
    activePaths?: boolean
    badges?: boolean
    missionsCompletedCount?: boolean
    recommendedPath?: boolean
    recommendedTools?: boolean
    predictedEngagementScore?: boolean
    confidenceScore?: boolean
    profileDrift?: boolean
    behavioralVibrancy?: boolean
    lastHypothesisUpdate?: boolean
    mentor?: boolean | User$mentorArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    level?: boolean
    experience?: boolean
    class?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pseudo?: boolean
    bio?: boolean
    country?: boolean
    city?: boolean
    language?: boolean
    ageRange?: boolean
    currentSituation?: boolean
    technicalLevel?: boolean
    domains?: boolean
    tools?: boolean
    githubUrl?: boolean
    portfolioUrl?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    mainObjective?: boolean
    secondaryObjectives?: boolean
    dominantMotivation?: boolean
    longTermObjective?: boolean
    preferredRhythm?: boolean
    onboardingSpeed?: boolean
    answerConsistency?: boolean
    connectionFrequency?: boolean
    dashboardActivity?: boolean
    communityEngagement?: boolean
    builderScore?: boolean
    creatorScore?: boolean
    strategistScore?: boolean
    catalystScore?: boolean
    polarization?: boolean
    profileStability?: boolean
    cohortsJoined?: boolean
    collaborativeProjects?: boolean
    mentorId?: boolean
    projectsRealized?: boolean
    activePaths?: boolean
    badges?: boolean
    missionsCompletedCount?: boolean
    recommendedPath?: boolean
    recommendedTools?: boolean
    predictedEngagementScore?: boolean
    confidenceScore?: boolean
    profileDrift?: boolean
    behavioralVibrancy?: boolean
    lastHypothesisUpdate?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "level" | "experience" | "class" | "role" | "createdAt" | "updatedAt" | "pseudo" | "bio" | "country" | "city" | "language" | "ageRange" | "currentSituation" | "technicalLevel" | "domains" | "tools" | "githubUrl" | "portfolioUrl" | "linkedinUrl" | "twitterUrl" | "mainObjective" | "secondaryObjectives" | "dominantMotivation" | "longTermObjective" | "preferredRhythm" | "onboardingSpeed" | "answerConsistency" | "connectionFrequency" | "dashboardActivity" | "communityEngagement" | "builderScore" | "creatorScore" | "strategistScore" | "catalystScore" | "polarization" | "profileStability" | "cohortsJoined" | "collaborativeProjects" | "mentorId" | "projectsRealized" | "activePaths" | "badges" | "missionsCompletedCount" | "recommendedPath" | "recommendedTools" | "predictedEngagementScore" | "confidenceScore" | "profileDrift" | "behavioralVibrancy" | "lastHypothesisUpdate", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentor?: boolean | User$mentorArgs<ExtArgs>
    mentees?: boolean | User$menteesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    quizResults?: boolean | User$quizResultsArgs<ExtArgs>
    guildMembers?: boolean | User$guildMembersArgs<ExtArgs>
    missionSubmissions?: boolean | User$missionSubmissionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentor?: boolean | User$mentorArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mentor?: boolean | User$mentorArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      mentor: Prisma.$UserPayload<ExtArgs> | null
      mentees: Prisma.$UserPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      quizResults: Prisma.$QuizResultPayload<ExtArgs>[]
      guildMembers: Prisma.$GuildMemberPayload<ExtArgs>[]
      missionSubmissions: Prisma.$MissionSubmissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      level: number
      experience: number
      class: string | null
      role: string
      createdAt: Date
      updatedAt: Date
      pseudo: string | null
      bio: string | null
      country: string | null
      city: string | null
      language: string
      ageRange: string | null
      currentSituation: string | null
      technicalLevel: string | null
      domains: string[]
      tools: string[]
      githubUrl: string | null
      portfolioUrl: string | null
      linkedinUrl: string | null
      twitterUrl: string | null
      mainObjective: string | null
      secondaryObjectives: string[]
      dominantMotivation: string | null
      longTermObjective: string | null
      preferredRhythm: string | null
      onboardingSpeed: number | null
      answerConsistency: number | null
      connectionFrequency: number | null
      dashboardActivity: number | null
      communityEngagement: number | null
      builderScore: number
      creatorScore: number
      strategistScore: number
      catalystScore: number
      polarization: number
      profileStability: number
      cohortsJoined: string[]
      collaborativeProjects: string[]
      mentorId: string | null
      projectsRealized: string[]
      activePaths: string[]
      badges: string[]
      missionsCompletedCount: number
      recommendedPath: string[]
      recommendedTools: string[]
      predictedEngagementScore: number | null
      confidenceScore: number
      profileDrift: number
      behavioralVibrancy: Prisma.JsonValue | null
      lastHypothesisUpdate: Date | null
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
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

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
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

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
    mentor<T extends User$mentorArgs<ExtArgs> = {}>(args?: Subset<T, User$mentorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mentees<T extends User$menteesArgs<ExtArgs> = {}>(args?: Subset<T, User$menteesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quizResults<T extends User$quizResultsArgs<ExtArgs> = {}>(args?: Subset<T, User$quizResultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guildMembers<T extends User$guildMembersArgs<ExtArgs> = {}>(args?: Subset<T, User$guildMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    missionSubmissions<T extends User$missionSubmissionsArgs<ExtArgs> = {}>(args?: Subset<T, User$missionSubmissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'Int'>
    readonly experience: FieldRef<"User", 'Int'>
    readonly class: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly pseudo: FieldRef<"User", 'String'>
    readonly bio: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly city: FieldRef<"User", 'String'>
    readonly language: FieldRef<"User", 'String'>
    readonly ageRange: FieldRef<"User", 'String'>
    readonly currentSituation: FieldRef<"User", 'String'>
    readonly technicalLevel: FieldRef<"User", 'String'>
    readonly domains: FieldRef<"User", 'String[]'>
    readonly tools: FieldRef<"User", 'String[]'>
    readonly githubUrl: FieldRef<"User", 'String'>
    readonly portfolioUrl: FieldRef<"User", 'String'>
    readonly linkedinUrl: FieldRef<"User", 'String'>
    readonly twitterUrl: FieldRef<"User", 'String'>
    readonly mainObjective: FieldRef<"User", 'String'>
    readonly secondaryObjectives: FieldRef<"User", 'String[]'>
    readonly dominantMotivation: FieldRef<"User", 'String'>
    readonly longTermObjective: FieldRef<"User", 'String'>
    readonly preferredRhythm: FieldRef<"User", 'String'>
    readonly onboardingSpeed: FieldRef<"User", 'Int'>
    readonly answerConsistency: FieldRef<"User", 'Float'>
    readonly connectionFrequency: FieldRef<"User", 'Float'>
    readonly dashboardActivity: FieldRef<"User", 'Float'>
    readonly communityEngagement: FieldRef<"User", 'Float'>
    readonly builderScore: FieldRef<"User", 'Int'>
    readonly creatorScore: FieldRef<"User", 'Int'>
    readonly strategistScore: FieldRef<"User", 'Int'>
    readonly catalystScore: FieldRef<"User", 'Int'>
    readonly polarization: FieldRef<"User", 'Float'>
    readonly profileStability: FieldRef<"User", 'Float'>
    readonly cohortsJoined: FieldRef<"User", 'String[]'>
    readonly collaborativeProjects: FieldRef<"User", 'String[]'>
    readonly mentorId: FieldRef<"User", 'String'>
    readonly projectsRealized: FieldRef<"User", 'String[]'>
    readonly activePaths: FieldRef<"User", 'String[]'>
    readonly badges: FieldRef<"User", 'String[]'>
    readonly missionsCompletedCount: FieldRef<"User", 'Int'>
    readonly recommendedPath: FieldRef<"User", 'String[]'>
    readonly recommendedTools: FieldRef<"User", 'String[]'>
    readonly predictedEngagementScore: FieldRef<"User", 'Float'>
    readonly confidenceScore: FieldRef<"User", 'Float'>
    readonly profileDrift: FieldRef<"User", 'Float'>
    readonly behavioralVibrancy: FieldRef<"User", 'Json'>
    readonly lastHypothesisUpdate: FieldRef<"User", 'DateTime'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User.mentor
   */
  export type User$mentorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * User.mentees
   */
  export type User$menteesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.quizResults
   */
  export type User$quizResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    where?: QuizResultWhereInput
    orderBy?: QuizResultOrderByWithRelationInput | QuizResultOrderByWithRelationInput[]
    cursor?: QuizResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizResultScalarFieldEnum | QuizResultScalarFieldEnum[]
  }

  /**
   * User.guildMembers
   */
  export type User$guildMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    where?: GuildMemberWhereInput
    orderBy?: GuildMemberOrderByWithRelationInput | GuildMemberOrderByWithRelationInput[]
    cursor?: GuildMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuildMemberScalarFieldEnum | GuildMemberScalarFieldEnum[]
  }

  /**
   * User.missionSubmissions
   */
  export type User$missionSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    where?: MissionSubmissionWhereInput
    orderBy?: MissionSubmissionOrderByWithRelationInput | MissionSubmissionOrderByWithRelationInput[]
    cursor?: MissionSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MissionSubmissionScalarFieldEnum | MissionSubmissionScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Mission
   */

  export type AggregateMission = {
    _count: MissionCountAggregateOutputType | null
    _avg: MissionAvgAggregateOutputType | null
    _sum: MissionSumAggregateOutputType | null
    _min: MissionMinAggregateOutputType | null
    _max: MissionMaxAggregateOutputType | null
  }

  export type MissionAvgAggregateOutputType = {
    difficulty: number | null
    xp: number | null
    weightBuilder: number | null
    weightCreator: number | null
    weightStrategist: number | null
    weightCatalyst: number | null
  }

  export type MissionSumAggregateOutputType = {
    difficulty: number | null
    xp: number | null
    weightBuilder: number | null
    weightCreator: number | null
    weightStrategist: number | null
    weightCatalyst: number | null
  }

  export type MissionMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    slug: string | null
    category: string | null
    difficulty: number | null
    xp: number | null
    weightBuilder: number | null
    weightCreator: number | null
    weightStrategist: number | null
    weightCatalyst: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MissionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    slug: string | null
    category: string | null
    difficulty: number | null
    xp: number | null
    weightBuilder: number | null
    weightCreator: number | null
    weightStrategist: number | null
    weightCatalyst: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MissionCountAggregateOutputType = {
    id: number
    title: number
    description: number
    slug: number
    category: number
    difficulty: number
    xp: number
    weightBuilder: number
    weightCreator: number
    weightStrategist: number
    weightCatalyst: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MissionAvgAggregateInputType = {
    difficulty?: true
    xp?: true
    weightBuilder?: true
    weightCreator?: true
    weightStrategist?: true
    weightCatalyst?: true
  }

  export type MissionSumAggregateInputType = {
    difficulty?: true
    xp?: true
    weightBuilder?: true
    weightCreator?: true
    weightStrategist?: true
    weightCatalyst?: true
  }

  export type MissionMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    slug?: true
    category?: true
    difficulty?: true
    xp?: true
    weightBuilder?: true
    weightCreator?: true
    weightStrategist?: true
    weightCatalyst?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MissionMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    slug?: true
    category?: true
    difficulty?: true
    xp?: true
    weightBuilder?: true
    weightCreator?: true
    weightStrategist?: true
    weightCatalyst?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MissionCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    slug?: true
    category?: true
    difficulty?: true
    xp?: true
    weightBuilder?: true
    weightCreator?: true
    weightStrategist?: true
    weightCatalyst?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mission to aggregate.
     */
    where?: MissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Missions to fetch.
     */
    orderBy?: MissionOrderByWithRelationInput | MissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Missions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Missions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Missions
    **/
    _count?: true | MissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MissionMaxAggregateInputType
  }

  export type GetMissionAggregateType<T extends MissionAggregateArgs> = {
        [P in keyof T & keyof AggregateMission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMission[P]>
      : GetScalarType<T[P], AggregateMission[P]>
  }




  export type MissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MissionWhereInput
    orderBy?: MissionOrderByWithAggregationInput | MissionOrderByWithAggregationInput[]
    by: MissionScalarFieldEnum[] | MissionScalarFieldEnum
    having?: MissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MissionCountAggregateInputType | true
    _avg?: MissionAvgAggregateInputType
    _sum?: MissionSumAggregateInputType
    _min?: MissionMinAggregateInputType
    _max?: MissionMaxAggregateInputType
  }

  export type MissionGroupByOutputType = {
    id: string
    title: string
    description: string
    slug: string
    category: string
    difficulty: number
    xp: number
    weightBuilder: number
    weightCreator: number
    weightStrategist: number
    weightCatalyst: number
    createdAt: Date
    updatedAt: Date
    _count: MissionCountAggregateOutputType | null
    _avg: MissionAvgAggregateOutputType | null
    _sum: MissionSumAggregateOutputType | null
    _min: MissionMinAggregateOutputType | null
    _max: MissionMaxAggregateOutputType | null
  }

  type GetMissionGroupByPayload<T extends MissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MissionGroupByOutputType[P]>
            : GetScalarType<T[P], MissionGroupByOutputType[P]>
        }
      >
    >


  export type MissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    slug?: boolean
    category?: boolean
    difficulty?: boolean
    xp?: boolean
    weightBuilder?: boolean
    weightCreator?: boolean
    weightStrategist?: boolean
    weightCatalyst?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    submissions?: boolean | Mission$submissionsArgs<ExtArgs>
    _count?: boolean | MissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mission"]>

  export type MissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    slug?: boolean
    category?: boolean
    difficulty?: boolean
    xp?: boolean
    weightBuilder?: boolean
    weightCreator?: boolean
    weightStrategist?: boolean
    weightCatalyst?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mission"]>

  export type MissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    slug?: boolean
    category?: boolean
    difficulty?: boolean
    xp?: boolean
    weightBuilder?: boolean
    weightCreator?: boolean
    weightStrategist?: boolean
    weightCatalyst?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mission"]>

  export type MissionSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    slug?: boolean
    category?: boolean
    difficulty?: boolean
    xp?: boolean
    weightBuilder?: boolean
    weightCreator?: boolean
    weightStrategist?: boolean
    weightCatalyst?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "slug" | "category" | "difficulty" | "xp" | "weightBuilder" | "weightCreator" | "weightStrategist" | "weightCatalyst" | "createdAt" | "updatedAt", ExtArgs["result"]["mission"]>
  export type MissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    submissions?: boolean | Mission$submissionsArgs<ExtArgs>
    _count?: boolean | MissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Mission"
    objects: {
      submissions: Prisma.$MissionSubmissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      slug: string
      category: string
      difficulty: number
      xp: number
      weightBuilder: number
      weightCreator: number
      weightStrategist: number
      weightCatalyst: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mission"]>
    composites: {}
  }

  type MissionGetPayload<S extends boolean | null | undefined | MissionDefaultArgs> = $Result.GetResult<Prisma.$MissionPayload, S>

  type MissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MissionCountAggregateInputType | true
    }

  export interface MissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Mission'], meta: { name: 'Mission' } }
    /**
     * Find zero or one Mission that matches the filter.
     * @param {MissionFindUniqueArgs} args - Arguments to find a Mission
     * @example
     * // Get one Mission
     * const mission = await prisma.mission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MissionFindUniqueArgs>(args: SelectSubset<T, MissionFindUniqueArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MissionFindUniqueOrThrowArgs} args - Arguments to find a Mission
     * @example
     * // Get one Mission
     * const mission = await prisma.mission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MissionFindUniqueOrThrowArgs>(args: SelectSubset<T, MissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionFindFirstArgs} args - Arguments to find a Mission
     * @example
     * // Get one Mission
     * const mission = await prisma.mission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MissionFindFirstArgs>(args?: SelectSubset<T, MissionFindFirstArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionFindFirstOrThrowArgs} args - Arguments to find a Mission
     * @example
     * // Get one Mission
     * const mission = await prisma.mission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MissionFindFirstOrThrowArgs>(args?: SelectSubset<T, MissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Missions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Missions
     * const missions = await prisma.mission.findMany()
     * 
     * // Get first 10 Missions
     * const missions = await prisma.mission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const missionWithIdOnly = await prisma.mission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MissionFindManyArgs>(args?: SelectSubset<T, MissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mission.
     * @param {MissionCreateArgs} args - Arguments to create a Mission.
     * @example
     * // Create one Mission
     * const Mission = await prisma.mission.create({
     *   data: {
     *     // ... data to create a Mission
     *   }
     * })
     * 
     */
    create<T extends MissionCreateArgs>(args: SelectSubset<T, MissionCreateArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Missions.
     * @param {MissionCreateManyArgs} args - Arguments to create many Missions.
     * @example
     * // Create many Missions
     * const mission = await prisma.mission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MissionCreateManyArgs>(args?: SelectSubset<T, MissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Missions and returns the data saved in the database.
     * @param {MissionCreateManyAndReturnArgs} args - Arguments to create many Missions.
     * @example
     * // Create many Missions
     * const mission = await prisma.mission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Missions and only return the `id`
     * const missionWithIdOnly = await prisma.mission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MissionCreateManyAndReturnArgs>(args?: SelectSubset<T, MissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mission.
     * @param {MissionDeleteArgs} args - Arguments to delete one Mission.
     * @example
     * // Delete one Mission
     * const Mission = await prisma.mission.delete({
     *   where: {
     *     // ... filter to delete one Mission
     *   }
     * })
     * 
     */
    delete<T extends MissionDeleteArgs>(args: SelectSubset<T, MissionDeleteArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mission.
     * @param {MissionUpdateArgs} args - Arguments to update one Mission.
     * @example
     * // Update one Mission
     * const mission = await prisma.mission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MissionUpdateArgs>(args: SelectSubset<T, MissionUpdateArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Missions.
     * @param {MissionDeleteManyArgs} args - Arguments to filter Missions to delete.
     * @example
     * // Delete a few Missions
     * const { count } = await prisma.mission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MissionDeleteManyArgs>(args?: SelectSubset<T, MissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Missions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Missions
     * const mission = await prisma.mission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MissionUpdateManyArgs>(args: SelectSubset<T, MissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Missions and returns the data updated in the database.
     * @param {MissionUpdateManyAndReturnArgs} args - Arguments to update many Missions.
     * @example
     * // Update many Missions
     * const mission = await prisma.mission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Missions and only return the `id`
     * const missionWithIdOnly = await prisma.mission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MissionUpdateManyAndReturnArgs>(args: SelectSubset<T, MissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mission.
     * @param {MissionUpsertArgs} args - Arguments to update or create a Mission.
     * @example
     * // Update or create a Mission
     * const mission = await prisma.mission.upsert({
     *   create: {
     *     // ... data to create a Mission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mission we want to update
     *   }
     * })
     */
    upsert<T extends MissionUpsertArgs>(args: SelectSubset<T, MissionUpsertArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Missions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionCountArgs} args - Arguments to filter Missions to count.
     * @example
     * // Count the number of Missions
     * const count = await prisma.mission.count({
     *   where: {
     *     // ... the filter for the Missions we want to count
     *   }
     * })
    **/
    count<T extends MissionCountArgs>(
      args?: Subset<T, MissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MissionAggregateArgs>(args: Subset<T, MissionAggregateArgs>): Prisma.PrismaPromise<GetMissionAggregateType<T>>

    /**
     * Group by Mission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionGroupByArgs} args - Group by arguments.
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
      T extends MissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MissionGroupByArgs['orderBy'] }
        : { orderBy?: MissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Mission model
   */
  readonly fields: MissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Mission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    submissions<T extends Mission$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, Mission$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Mission model
   */
  interface MissionFieldRefs {
    readonly id: FieldRef<"Mission", 'String'>
    readonly title: FieldRef<"Mission", 'String'>
    readonly description: FieldRef<"Mission", 'String'>
    readonly slug: FieldRef<"Mission", 'String'>
    readonly category: FieldRef<"Mission", 'String'>
    readonly difficulty: FieldRef<"Mission", 'Int'>
    readonly xp: FieldRef<"Mission", 'Int'>
    readonly weightBuilder: FieldRef<"Mission", 'Float'>
    readonly weightCreator: FieldRef<"Mission", 'Float'>
    readonly weightStrategist: FieldRef<"Mission", 'Float'>
    readonly weightCatalyst: FieldRef<"Mission", 'Float'>
    readonly createdAt: FieldRef<"Mission", 'DateTime'>
    readonly updatedAt: FieldRef<"Mission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Mission findUnique
   */
  export type MissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * Filter, which Mission to fetch.
     */
    where: MissionWhereUniqueInput
  }

  /**
   * Mission findUniqueOrThrow
   */
  export type MissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * Filter, which Mission to fetch.
     */
    where: MissionWhereUniqueInput
  }

  /**
   * Mission findFirst
   */
  export type MissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * Filter, which Mission to fetch.
     */
    where?: MissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Missions to fetch.
     */
    orderBy?: MissionOrderByWithRelationInput | MissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Missions.
     */
    cursor?: MissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Missions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Missions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Missions.
     */
    distinct?: MissionScalarFieldEnum | MissionScalarFieldEnum[]
  }

  /**
   * Mission findFirstOrThrow
   */
  export type MissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * Filter, which Mission to fetch.
     */
    where?: MissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Missions to fetch.
     */
    orderBy?: MissionOrderByWithRelationInput | MissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Missions.
     */
    cursor?: MissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Missions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Missions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Missions.
     */
    distinct?: MissionScalarFieldEnum | MissionScalarFieldEnum[]
  }

  /**
   * Mission findMany
   */
  export type MissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * Filter, which Missions to fetch.
     */
    where?: MissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Missions to fetch.
     */
    orderBy?: MissionOrderByWithRelationInput | MissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Missions.
     */
    cursor?: MissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Missions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Missions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Missions.
     */
    distinct?: MissionScalarFieldEnum | MissionScalarFieldEnum[]
  }

  /**
   * Mission create
   */
  export type MissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Mission.
     */
    data: XOR<MissionCreateInput, MissionUncheckedCreateInput>
  }

  /**
   * Mission createMany
   */
  export type MissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Missions.
     */
    data: MissionCreateManyInput | MissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mission createManyAndReturn
   */
  export type MissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * The data used to create many Missions.
     */
    data: MissionCreateManyInput | MissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mission update
   */
  export type MissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Mission.
     */
    data: XOR<MissionUpdateInput, MissionUncheckedUpdateInput>
    /**
     * Choose, which Mission to update.
     */
    where: MissionWhereUniqueInput
  }

  /**
   * Mission updateMany
   */
  export type MissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Missions.
     */
    data: XOR<MissionUpdateManyMutationInput, MissionUncheckedUpdateManyInput>
    /**
     * Filter which Missions to update
     */
    where?: MissionWhereInput
    /**
     * Limit how many Missions to update.
     */
    limit?: number
  }

  /**
   * Mission updateManyAndReturn
   */
  export type MissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * The data used to update Missions.
     */
    data: XOR<MissionUpdateManyMutationInput, MissionUncheckedUpdateManyInput>
    /**
     * Filter which Missions to update
     */
    where?: MissionWhereInput
    /**
     * Limit how many Missions to update.
     */
    limit?: number
  }

  /**
   * Mission upsert
   */
  export type MissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Mission to update in case it exists.
     */
    where: MissionWhereUniqueInput
    /**
     * In case the Mission found by the `where` argument doesn't exist, create a new Mission with this data.
     */
    create: XOR<MissionCreateInput, MissionUncheckedCreateInput>
    /**
     * In case the Mission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MissionUpdateInput, MissionUncheckedUpdateInput>
  }

  /**
   * Mission delete
   */
  export type MissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
    /**
     * Filter which Mission to delete.
     */
    where: MissionWhereUniqueInput
  }

  /**
   * Mission deleteMany
   */
  export type MissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Missions to delete
     */
    where?: MissionWhereInput
    /**
     * Limit how many Missions to delete.
     */
    limit?: number
  }

  /**
   * Mission.submissions
   */
  export type Mission$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    where?: MissionSubmissionWhereInput
    orderBy?: MissionSubmissionOrderByWithRelationInput | MissionSubmissionOrderByWithRelationInput[]
    cursor?: MissionSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MissionSubmissionScalarFieldEnum | MissionSubmissionScalarFieldEnum[]
  }

  /**
   * Mission without action
   */
  export type MissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mission
     */
    select?: MissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mission
     */
    omit?: MissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionInclude<ExtArgs> | null
  }


  /**
   * Model Guild
   */

  export type AggregateGuild = {
    _count: GuildCountAggregateOutputType | null
    _avg: GuildAvgAggregateOutputType | null
    _sum: GuildSumAggregateOutputType | null
    _min: GuildMinAggregateOutputType | null
    _max: GuildMaxAggregateOutputType | null
  }

  export type GuildAvgAggregateOutputType = {
    requiredLevel: number | null
  }

  export type GuildSumAggregateOutputType = {
    requiredLevel: number | null
  }

  export type GuildMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    slug: string | null
    requiredLevel: number | null
    isPrivate: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GuildMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    slug: string | null
    requiredLevel: number | null
    isPrivate: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GuildCountAggregateOutputType = {
    id: number
    name: number
    description: number
    slug: number
    requiredLevel: number
    isPrivate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GuildAvgAggregateInputType = {
    requiredLevel?: true
  }

  export type GuildSumAggregateInputType = {
    requiredLevel?: true
  }

  export type GuildMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    slug?: true
    requiredLevel?: true
    isPrivate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GuildMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    slug?: true
    requiredLevel?: true
    isPrivate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GuildCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    slug?: true
    requiredLevel?: true
    isPrivate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GuildAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guild to aggregate.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guilds
    **/
    _count?: true | GuildCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildMaxAggregateInputType
  }

  export type GetGuildAggregateType<T extends GuildAggregateArgs> = {
        [P in keyof T & keyof AggregateGuild]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuild[P]>
      : GetScalarType<T[P], AggregateGuild[P]>
  }




  export type GuildGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildWhereInput
    orderBy?: GuildOrderByWithAggregationInput | GuildOrderByWithAggregationInput[]
    by: GuildScalarFieldEnum[] | GuildScalarFieldEnum
    having?: GuildScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildCountAggregateInputType | true
    _avg?: GuildAvgAggregateInputType
    _sum?: GuildSumAggregateInputType
    _min?: GuildMinAggregateInputType
    _max?: GuildMaxAggregateInputType
  }

  export type GuildGroupByOutputType = {
    id: string
    name: string
    description: string | null
    slug: string
    requiredLevel: number
    isPrivate: boolean
    createdAt: Date
    updatedAt: Date
    _count: GuildCountAggregateOutputType | null
    _avg: GuildAvgAggregateOutputType | null
    _sum: GuildSumAggregateOutputType | null
    _min: GuildMinAggregateOutputType | null
    _max: GuildMaxAggregateOutputType | null
  }

  type GetGuildGroupByPayload<T extends GuildGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildGroupByOutputType[P]>
            : GetScalarType<T[P], GuildGroupByOutputType[P]>
        }
      >
    >


  export type GuildSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    slug?: boolean
    requiredLevel?: boolean
    isPrivate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Guild$membersArgs<ExtArgs>
    _count?: boolean | GuildCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guild"]>

  export type GuildSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    slug?: boolean
    requiredLevel?: boolean
    isPrivate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["guild"]>

  export type GuildSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    slug?: boolean
    requiredLevel?: boolean
    isPrivate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["guild"]>

  export type GuildSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    slug?: boolean
    requiredLevel?: boolean
    isPrivate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GuildOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "slug" | "requiredLevel" | "isPrivate" | "createdAt" | "updatedAt", ExtArgs["result"]["guild"]>
  export type GuildInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Guild$membersArgs<ExtArgs>
    _count?: boolean | GuildCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GuildIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GuildIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GuildPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Guild"
    objects: {
      members: Prisma.$GuildMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      slug: string
      requiredLevel: number
      isPrivate: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["guild"]>
    composites: {}
  }

  type GuildGetPayload<S extends boolean | null | undefined | GuildDefaultArgs> = $Result.GetResult<Prisma.$GuildPayload, S>

  type GuildCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildCountAggregateInputType | true
    }

  export interface GuildDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Guild'], meta: { name: 'Guild' } }
    /**
     * Find zero or one Guild that matches the filter.
     * @param {GuildFindUniqueArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildFindUniqueArgs>(args: SelectSubset<T, GuildFindUniqueArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Guild that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildFindUniqueOrThrowArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guild that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildFindFirstArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildFindFirstArgs>(args?: SelectSubset<T, GuildFindFirstArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guild that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildFindFirstOrThrowArgs} args - Arguments to find a Guild
     * @example
     * // Get one Guild
     * const guild = await prisma.guild.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Guilds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guilds
     * const guilds = await prisma.guild.findMany()
     * 
     * // Get first 10 Guilds
     * const guilds = await prisma.guild.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildWithIdOnly = await prisma.guild.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildFindManyArgs>(args?: SelectSubset<T, GuildFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Guild.
     * @param {GuildCreateArgs} args - Arguments to create a Guild.
     * @example
     * // Create one Guild
     * const Guild = await prisma.guild.create({
     *   data: {
     *     // ... data to create a Guild
     *   }
     * })
     * 
     */
    create<T extends GuildCreateArgs>(args: SelectSubset<T, GuildCreateArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Guilds.
     * @param {GuildCreateManyArgs} args - Arguments to create many Guilds.
     * @example
     * // Create many Guilds
     * const guild = await prisma.guild.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildCreateManyArgs>(args?: SelectSubset<T, GuildCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Guilds and returns the data saved in the database.
     * @param {GuildCreateManyAndReturnArgs} args - Arguments to create many Guilds.
     * @example
     * // Create many Guilds
     * const guild = await prisma.guild.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Guilds and only return the `id`
     * const guildWithIdOnly = await prisma.guild.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Guild.
     * @param {GuildDeleteArgs} args - Arguments to delete one Guild.
     * @example
     * // Delete one Guild
     * const Guild = await prisma.guild.delete({
     *   where: {
     *     // ... filter to delete one Guild
     *   }
     * })
     * 
     */
    delete<T extends GuildDeleteArgs>(args: SelectSubset<T, GuildDeleteArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Guild.
     * @param {GuildUpdateArgs} args - Arguments to update one Guild.
     * @example
     * // Update one Guild
     * const guild = await prisma.guild.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildUpdateArgs>(args: SelectSubset<T, GuildUpdateArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Guilds.
     * @param {GuildDeleteManyArgs} args - Arguments to filter Guilds to delete.
     * @example
     * // Delete a few Guilds
     * const { count } = await prisma.guild.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildDeleteManyArgs>(args?: SelectSubset<T, GuildDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guilds
     * const guild = await prisma.guild.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildUpdateManyArgs>(args: SelectSubset<T, GuildUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guilds and returns the data updated in the database.
     * @param {GuildUpdateManyAndReturnArgs} args - Arguments to update many Guilds.
     * @example
     * // Update many Guilds
     * const guild = await prisma.guild.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Guilds and only return the `id`
     * const guildWithIdOnly = await prisma.guild.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Guild.
     * @param {GuildUpsertArgs} args - Arguments to update or create a Guild.
     * @example
     * // Update or create a Guild
     * const guild = await prisma.guild.upsert({
     *   create: {
     *     // ... data to create a Guild
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guild we want to update
     *   }
     * })
     */
    upsert<T extends GuildUpsertArgs>(args: SelectSubset<T, GuildUpsertArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildCountArgs} args - Arguments to filter Guilds to count.
     * @example
     * // Count the number of Guilds
     * const count = await prisma.guild.count({
     *   where: {
     *     // ... the filter for the Guilds we want to count
     *   }
     * })
    **/
    count<T extends GuildCountArgs>(
      args?: Subset<T, GuildCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guild.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuildAggregateArgs>(args: Subset<T, GuildAggregateArgs>): Prisma.PrismaPromise<GetGuildAggregateType<T>>

    /**
     * Group by Guild.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildGroupByArgs} args - Group by arguments.
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
      T extends GuildGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildGroupByArgs['orderBy'] }
        : { orderBy?: GuildGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GuildGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Guild model
   */
  readonly fields: GuildFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Guild.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Guild$membersArgs<ExtArgs> = {}>(args?: Subset<T, Guild$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Guild model
   */
  interface GuildFieldRefs {
    readonly id: FieldRef<"Guild", 'String'>
    readonly name: FieldRef<"Guild", 'String'>
    readonly description: FieldRef<"Guild", 'String'>
    readonly slug: FieldRef<"Guild", 'String'>
    readonly requiredLevel: FieldRef<"Guild", 'Int'>
    readonly isPrivate: FieldRef<"Guild", 'Boolean'>
    readonly createdAt: FieldRef<"Guild", 'DateTime'>
    readonly updatedAt: FieldRef<"Guild", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Guild findUnique
   */
  export type GuildFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild findUniqueOrThrow
   */
  export type GuildFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild findFirst
   */
  export type GuildFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guilds.
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guilds.
     */
    distinct?: GuildScalarFieldEnum | GuildScalarFieldEnum[]
  }

  /**
   * Guild findFirstOrThrow
   */
  export type GuildFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guild to fetch.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guilds.
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guilds.
     */
    distinct?: GuildScalarFieldEnum | GuildScalarFieldEnum[]
  }

  /**
   * Guild findMany
   */
  export type GuildFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter, which Guilds to fetch.
     */
    where?: GuildWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guilds to fetch.
     */
    orderBy?: GuildOrderByWithRelationInput | GuildOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guilds.
     */
    cursor?: GuildWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guilds.
     */
    distinct?: GuildScalarFieldEnum | GuildScalarFieldEnum[]
  }

  /**
   * Guild create
   */
  export type GuildCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * The data needed to create a Guild.
     */
    data: XOR<GuildCreateInput, GuildUncheckedCreateInput>
  }

  /**
   * Guild createMany
   */
  export type GuildCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Guilds.
     */
    data: GuildCreateManyInput | GuildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guild createManyAndReturn
   */
  export type GuildCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * The data used to create many Guilds.
     */
    data: GuildCreateManyInput | GuildCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guild update
   */
  export type GuildUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * The data needed to update a Guild.
     */
    data: XOR<GuildUpdateInput, GuildUncheckedUpdateInput>
    /**
     * Choose, which Guild to update.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild updateMany
   */
  export type GuildUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Guilds.
     */
    data: XOR<GuildUpdateManyMutationInput, GuildUncheckedUpdateManyInput>
    /**
     * Filter which Guilds to update
     */
    where?: GuildWhereInput
    /**
     * Limit how many Guilds to update.
     */
    limit?: number
  }

  /**
   * Guild updateManyAndReturn
   */
  export type GuildUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * The data used to update Guilds.
     */
    data: XOR<GuildUpdateManyMutationInput, GuildUncheckedUpdateManyInput>
    /**
     * Filter which Guilds to update
     */
    where?: GuildWhereInput
    /**
     * Limit how many Guilds to update.
     */
    limit?: number
  }

  /**
   * Guild upsert
   */
  export type GuildUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * The filter to search for the Guild to update in case it exists.
     */
    where: GuildWhereUniqueInput
    /**
     * In case the Guild found by the `where` argument doesn't exist, create a new Guild with this data.
     */
    create: XOR<GuildCreateInput, GuildUncheckedCreateInput>
    /**
     * In case the Guild was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildUpdateInput, GuildUncheckedUpdateInput>
  }

  /**
   * Guild delete
   */
  export type GuildDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
    /**
     * Filter which Guild to delete.
     */
    where: GuildWhereUniqueInput
  }

  /**
   * Guild deleteMany
   */
  export type GuildDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guilds to delete
     */
    where?: GuildWhereInput
    /**
     * Limit how many Guilds to delete.
     */
    limit?: number
  }

  /**
   * Guild.members
   */
  export type Guild$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    where?: GuildMemberWhereInput
    orderBy?: GuildMemberOrderByWithRelationInput | GuildMemberOrderByWithRelationInput[]
    cursor?: GuildMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuildMemberScalarFieldEnum | GuildMemberScalarFieldEnum[]
  }

  /**
   * Guild without action
   */
  export type GuildDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guild
     */
    select?: GuildSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guild
     */
    omit?: GuildOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildInclude<ExtArgs> | null
  }


  /**
   * Model GuildMember
   */

  export type AggregateGuildMember = {
    _count: GuildMemberCountAggregateOutputType | null
    _min: GuildMemberMinAggregateOutputType | null
    _max: GuildMemberMaxAggregateOutputType | null
  }

  export type GuildMemberMinAggregateOutputType = {
    id: string | null
    userId: string | null
    guildId: string | null
    role: string | null
    joinedAt: Date | null
  }

  export type GuildMemberMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    guildId: string | null
    role: string | null
    joinedAt: Date | null
  }

  export type GuildMemberCountAggregateOutputType = {
    id: number
    userId: number
    guildId: number
    role: number
    joinedAt: number
    _all: number
  }


  export type GuildMemberMinAggregateInputType = {
    id?: true
    userId?: true
    guildId?: true
    role?: true
    joinedAt?: true
  }

  export type GuildMemberMaxAggregateInputType = {
    id?: true
    userId?: true
    guildId?: true
    role?: true
    joinedAt?: true
  }

  export type GuildMemberCountAggregateInputType = {
    id?: true
    userId?: true
    guildId?: true
    role?: true
    joinedAt?: true
    _all?: true
  }

  export type GuildMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildMember to aggregate.
     */
    where?: GuildMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildMembers to fetch.
     */
    orderBy?: GuildMemberOrderByWithRelationInput | GuildMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuildMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuildMembers
    **/
    _count?: true | GuildMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildMemberMaxAggregateInputType
  }

  export type GetGuildMemberAggregateType<T extends GuildMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateGuildMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuildMember[P]>
      : GetScalarType<T[P], AggregateGuildMember[P]>
  }




  export type GuildMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuildMemberWhereInput
    orderBy?: GuildMemberOrderByWithAggregationInput | GuildMemberOrderByWithAggregationInput[]
    by: GuildMemberScalarFieldEnum[] | GuildMemberScalarFieldEnum
    having?: GuildMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildMemberCountAggregateInputType | true
    _min?: GuildMemberMinAggregateInputType
    _max?: GuildMemberMaxAggregateInputType
  }

  export type GuildMemberGroupByOutputType = {
    id: string
    userId: string
    guildId: string
    role: string
    joinedAt: Date
    _count: GuildMemberCountAggregateOutputType | null
    _min: GuildMemberMinAggregateOutputType | null
    _max: GuildMemberMaxAggregateOutputType | null
  }

  type GetGuildMemberGroupByPayload<T extends GuildMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildMemberGroupByOutputType[P]>
            : GetScalarType<T[P], GuildMemberGroupByOutputType[P]>
        }
      >
    >


  export type GuildMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    guildId?: boolean
    role?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildMember"]>

  export type GuildMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    guildId?: boolean
    role?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildMember"]>

  export type GuildMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    guildId?: boolean
    role?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guildMember"]>

  export type GuildMemberSelectScalar = {
    id?: boolean
    userId?: boolean
    guildId?: boolean
    role?: boolean
    joinedAt?: boolean
  }

  export type GuildMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "guildId" | "role" | "joinedAt", ExtArgs["result"]["guildMember"]>
  export type GuildMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }
  export type GuildMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    guild?: boolean | GuildDefaultArgs<ExtArgs>
  }

  export type $GuildMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuildMember"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      guild: Prisma.$GuildPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      guildId: string
      role: string
      joinedAt: Date
    }, ExtArgs["result"]["guildMember"]>
    composites: {}
  }

  type GuildMemberGetPayload<S extends boolean | null | undefined | GuildMemberDefaultArgs> = $Result.GetResult<Prisma.$GuildMemberPayload, S>

  type GuildMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuildMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildMemberCountAggregateInputType | true
    }

  export interface GuildMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuildMember'], meta: { name: 'GuildMember' } }
    /**
     * Find zero or one GuildMember that matches the filter.
     * @param {GuildMemberFindUniqueArgs} args - Arguments to find a GuildMember
     * @example
     * // Get one GuildMember
     * const guildMember = await prisma.guildMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuildMemberFindUniqueArgs>(args: SelectSubset<T, GuildMemberFindUniqueArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuildMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuildMemberFindUniqueOrThrowArgs} args - Arguments to find a GuildMember
     * @example
     * // Get one GuildMember
     * const guildMember = await prisma.guildMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuildMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, GuildMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberFindFirstArgs} args - Arguments to find a GuildMember
     * @example
     * // Get one GuildMember
     * const guildMember = await prisma.guildMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuildMemberFindFirstArgs>(args?: SelectSubset<T, GuildMemberFindFirstArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuildMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberFindFirstOrThrowArgs} args - Arguments to find a GuildMember
     * @example
     * // Get one GuildMember
     * const guildMember = await prisma.guildMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuildMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, GuildMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuildMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuildMembers
     * const guildMembers = await prisma.guildMember.findMany()
     * 
     * // Get first 10 GuildMembers
     * const guildMembers = await prisma.guildMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildMemberWithIdOnly = await prisma.guildMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuildMemberFindManyArgs>(args?: SelectSubset<T, GuildMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuildMember.
     * @param {GuildMemberCreateArgs} args - Arguments to create a GuildMember.
     * @example
     * // Create one GuildMember
     * const GuildMember = await prisma.guildMember.create({
     *   data: {
     *     // ... data to create a GuildMember
     *   }
     * })
     * 
     */
    create<T extends GuildMemberCreateArgs>(args: SelectSubset<T, GuildMemberCreateArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuildMembers.
     * @param {GuildMemberCreateManyArgs} args - Arguments to create many GuildMembers.
     * @example
     * // Create many GuildMembers
     * const guildMember = await prisma.guildMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuildMemberCreateManyArgs>(args?: SelectSubset<T, GuildMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuildMembers and returns the data saved in the database.
     * @param {GuildMemberCreateManyAndReturnArgs} args - Arguments to create many GuildMembers.
     * @example
     * // Create many GuildMembers
     * const guildMember = await prisma.guildMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuildMembers and only return the `id`
     * const guildMemberWithIdOnly = await prisma.guildMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuildMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, GuildMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuildMember.
     * @param {GuildMemberDeleteArgs} args - Arguments to delete one GuildMember.
     * @example
     * // Delete one GuildMember
     * const GuildMember = await prisma.guildMember.delete({
     *   where: {
     *     // ... filter to delete one GuildMember
     *   }
     * })
     * 
     */
    delete<T extends GuildMemberDeleteArgs>(args: SelectSubset<T, GuildMemberDeleteArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuildMember.
     * @param {GuildMemberUpdateArgs} args - Arguments to update one GuildMember.
     * @example
     * // Update one GuildMember
     * const guildMember = await prisma.guildMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuildMemberUpdateArgs>(args: SelectSubset<T, GuildMemberUpdateArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuildMembers.
     * @param {GuildMemberDeleteManyArgs} args - Arguments to filter GuildMembers to delete.
     * @example
     * // Delete a few GuildMembers
     * const { count } = await prisma.guildMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuildMemberDeleteManyArgs>(args?: SelectSubset<T, GuildMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuildMembers
     * const guildMember = await prisma.guildMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuildMemberUpdateManyArgs>(args: SelectSubset<T, GuildMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuildMembers and returns the data updated in the database.
     * @param {GuildMemberUpdateManyAndReturnArgs} args - Arguments to update many GuildMembers.
     * @example
     * // Update many GuildMembers
     * const guildMember = await prisma.guildMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuildMembers and only return the `id`
     * const guildMemberWithIdOnly = await prisma.guildMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuildMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, GuildMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuildMember.
     * @param {GuildMemberUpsertArgs} args - Arguments to update or create a GuildMember.
     * @example
     * // Update or create a GuildMember
     * const guildMember = await prisma.guildMember.upsert({
     *   create: {
     *     // ... data to create a GuildMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuildMember we want to update
     *   }
     * })
     */
    upsert<T extends GuildMemberUpsertArgs>(args: SelectSubset<T, GuildMemberUpsertArgs<ExtArgs>>): Prisma__GuildMemberClient<$Result.GetResult<Prisma.$GuildMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuildMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberCountArgs} args - Arguments to filter GuildMembers to count.
     * @example
     * // Count the number of GuildMembers
     * const count = await prisma.guildMember.count({
     *   where: {
     *     // ... the filter for the GuildMembers we want to count
     *   }
     * })
    **/
    count<T extends GuildMemberCountArgs>(
      args?: Subset<T, GuildMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuildMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuildMemberAggregateArgs>(args: Subset<T, GuildMemberAggregateArgs>): Prisma.PrismaPromise<GetGuildMemberAggregateType<T>>

    /**
     * Group by GuildMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildMemberGroupByArgs} args - Group by arguments.
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
      T extends GuildMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuildMemberGroupByArgs['orderBy'] }
        : { orderBy?: GuildMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GuildMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuildMember model
   */
  readonly fields: GuildMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuildMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuildMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    guild<T extends GuildDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuildDefaultArgs<ExtArgs>>): Prisma__GuildClient<$Result.GetResult<Prisma.$GuildPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the GuildMember model
   */
  interface GuildMemberFieldRefs {
    readonly id: FieldRef<"GuildMember", 'String'>
    readonly userId: FieldRef<"GuildMember", 'String'>
    readonly guildId: FieldRef<"GuildMember", 'String'>
    readonly role: FieldRef<"GuildMember", 'String'>
    readonly joinedAt: FieldRef<"GuildMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuildMember findUnique
   */
  export type GuildMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * Filter, which GuildMember to fetch.
     */
    where: GuildMemberWhereUniqueInput
  }

  /**
   * GuildMember findUniqueOrThrow
   */
  export type GuildMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * Filter, which GuildMember to fetch.
     */
    where: GuildMemberWhereUniqueInput
  }

  /**
   * GuildMember findFirst
   */
  export type GuildMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * Filter, which GuildMember to fetch.
     */
    where?: GuildMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildMembers to fetch.
     */
    orderBy?: GuildMemberOrderByWithRelationInput | GuildMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildMembers.
     */
    cursor?: GuildMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildMembers.
     */
    distinct?: GuildMemberScalarFieldEnum | GuildMemberScalarFieldEnum[]
  }

  /**
   * GuildMember findFirstOrThrow
   */
  export type GuildMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * Filter, which GuildMember to fetch.
     */
    where?: GuildMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildMembers to fetch.
     */
    orderBy?: GuildMemberOrderByWithRelationInput | GuildMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuildMembers.
     */
    cursor?: GuildMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildMembers.
     */
    distinct?: GuildMemberScalarFieldEnum | GuildMemberScalarFieldEnum[]
  }

  /**
   * GuildMember findMany
   */
  export type GuildMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * Filter, which GuildMembers to fetch.
     */
    where?: GuildMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuildMembers to fetch.
     */
    orderBy?: GuildMemberOrderByWithRelationInput | GuildMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuildMembers.
     */
    cursor?: GuildMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuildMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuildMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuildMembers.
     */
    distinct?: GuildMemberScalarFieldEnum | GuildMemberScalarFieldEnum[]
  }

  /**
   * GuildMember create
   */
  export type GuildMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a GuildMember.
     */
    data: XOR<GuildMemberCreateInput, GuildMemberUncheckedCreateInput>
  }

  /**
   * GuildMember createMany
   */
  export type GuildMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuildMembers.
     */
    data: GuildMemberCreateManyInput | GuildMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuildMember createManyAndReturn
   */
  export type GuildMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * The data used to create many GuildMembers.
     */
    data: GuildMemberCreateManyInput | GuildMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildMember update
   */
  export type GuildMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a GuildMember.
     */
    data: XOR<GuildMemberUpdateInput, GuildMemberUncheckedUpdateInput>
    /**
     * Choose, which GuildMember to update.
     */
    where: GuildMemberWhereUniqueInput
  }

  /**
   * GuildMember updateMany
   */
  export type GuildMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuildMembers.
     */
    data: XOR<GuildMemberUpdateManyMutationInput, GuildMemberUncheckedUpdateManyInput>
    /**
     * Filter which GuildMembers to update
     */
    where?: GuildMemberWhereInput
    /**
     * Limit how many GuildMembers to update.
     */
    limit?: number
  }

  /**
   * GuildMember updateManyAndReturn
   */
  export type GuildMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * The data used to update GuildMembers.
     */
    data: XOR<GuildMemberUpdateManyMutationInput, GuildMemberUncheckedUpdateManyInput>
    /**
     * Filter which GuildMembers to update
     */
    where?: GuildMemberWhereInput
    /**
     * Limit how many GuildMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuildMember upsert
   */
  export type GuildMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the GuildMember to update in case it exists.
     */
    where: GuildMemberWhereUniqueInput
    /**
     * In case the GuildMember found by the `where` argument doesn't exist, create a new GuildMember with this data.
     */
    create: XOR<GuildMemberCreateInput, GuildMemberUncheckedCreateInput>
    /**
     * In case the GuildMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuildMemberUpdateInput, GuildMemberUncheckedUpdateInput>
  }

  /**
   * GuildMember delete
   */
  export type GuildMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
    /**
     * Filter which GuildMember to delete.
     */
    where: GuildMemberWhereUniqueInput
  }

  /**
   * GuildMember deleteMany
   */
  export type GuildMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuildMembers to delete
     */
    where?: GuildMemberWhereInput
    /**
     * Limit how many GuildMembers to delete.
     */
    limit?: number
  }

  /**
   * GuildMember without action
   */
  export type GuildMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuildMember
     */
    select?: GuildMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuildMember
     */
    omit?: GuildMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuildMemberInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date | null
    updatedAt: Date | null
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
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
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model QuizResult
   */

  export type AggregateQuizResult = {
    _count: QuizResultCountAggregateOutputType | null
    _avg: QuizResultAvgAggregateOutputType | null
    _sum: QuizResultSumAggregateOutputType | null
    _min: QuizResultMinAggregateOutputType | null
    _max: QuizResultMaxAggregateOutputType | null
  }

  export type QuizResultAvgAggregateOutputType = {
    score: number | null
    averageResponseTime: number | null
  }

  export type QuizResultSumAggregateOutputType = {
    score: number | null
    averageResponseTime: number | null
  }

  export type QuizResultMinAggregateOutputType = {
    id: string | null
    userId: string | null
    profileType: string | null
    score: number | null
    averageResponseTime: number | null
    createdAt: Date | null
  }

  export type QuizResultMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    profileType: string | null
    score: number | null
    averageResponseTime: number | null
    createdAt: Date | null
  }

  export type QuizResultCountAggregateOutputType = {
    id: number
    userId: number
    profileType: number
    score: number
    answers: number
    averageResponseTime: number
    detailedResponseTimes: number
    createdAt: number
    _all: number
  }


  export type QuizResultAvgAggregateInputType = {
    score?: true
    averageResponseTime?: true
  }

  export type QuizResultSumAggregateInputType = {
    score?: true
    averageResponseTime?: true
  }

  export type QuizResultMinAggregateInputType = {
    id?: true
    userId?: true
    profileType?: true
    score?: true
    averageResponseTime?: true
    createdAt?: true
  }

  export type QuizResultMaxAggregateInputType = {
    id?: true
    userId?: true
    profileType?: true
    score?: true
    averageResponseTime?: true
    createdAt?: true
  }

  export type QuizResultCountAggregateInputType = {
    id?: true
    userId?: true
    profileType?: true
    score?: true
    answers?: true
    averageResponseTime?: true
    detailedResponseTimes?: true
    createdAt?: true
    _all?: true
  }

  export type QuizResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizResult to aggregate.
     */
    where?: QuizResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizResults to fetch.
     */
    orderBy?: QuizResultOrderByWithRelationInput | QuizResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizResults
    **/
    _count?: true | QuizResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizResultMaxAggregateInputType
  }

  export type GetQuizResultAggregateType<T extends QuizResultAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizResult[P]>
      : GetScalarType<T[P], AggregateQuizResult[P]>
  }




  export type QuizResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizResultWhereInput
    orderBy?: QuizResultOrderByWithAggregationInput | QuizResultOrderByWithAggregationInput[]
    by: QuizResultScalarFieldEnum[] | QuizResultScalarFieldEnum
    having?: QuizResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizResultCountAggregateInputType | true
    _avg?: QuizResultAvgAggregateInputType
    _sum?: QuizResultSumAggregateInputType
    _min?: QuizResultMinAggregateInputType
    _max?: QuizResultMaxAggregateInputType
  }

  export type QuizResultGroupByOutputType = {
    id: string
    userId: string | null
    profileType: string
    score: number | null
    answers: JsonValue
    averageResponseTime: number | null
    detailedResponseTimes: JsonValue | null
    createdAt: Date
    _count: QuizResultCountAggregateOutputType | null
    _avg: QuizResultAvgAggregateOutputType | null
    _sum: QuizResultSumAggregateOutputType | null
    _min: QuizResultMinAggregateOutputType | null
    _max: QuizResultMaxAggregateOutputType | null
  }

  type GetQuizResultGroupByPayload<T extends QuizResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizResultGroupByOutputType[P]>
            : GetScalarType<T[P], QuizResultGroupByOutputType[P]>
        }
      >
    >


  export type QuizResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    profileType?: boolean
    score?: boolean
    answers?: boolean
    averageResponseTime?: boolean
    detailedResponseTimes?: boolean
    createdAt?: boolean
    user?: boolean | QuizResult$userArgs<ExtArgs>
  }, ExtArgs["result"]["quizResult"]>

  export type QuizResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    profileType?: boolean
    score?: boolean
    answers?: boolean
    averageResponseTime?: boolean
    detailedResponseTimes?: boolean
    createdAt?: boolean
    user?: boolean | QuizResult$userArgs<ExtArgs>
  }, ExtArgs["result"]["quizResult"]>

  export type QuizResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    profileType?: boolean
    score?: boolean
    answers?: boolean
    averageResponseTime?: boolean
    detailedResponseTimes?: boolean
    createdAt?: boolean
    user?: boolean | QuizResult$userArgs<ExtArgs>
  }, ExtArgs["result"]["quizResult"]>

  export type QuizResultSelectScalar = {
    id?: boolean
    userId?: boolean
    profileType?: boolean
    score?: boolean
    answers?: boolean
    averageResponseTime?: boolean
    detailedResponseTimes?: boolean
    createdAt?: boolean
  }

  export type QuizResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "profileType" | "score" | "answers" | "averageResponseTime" | "detailedResponseTimes" | "createdAt", ExtArgs["result"]["quizResult"]>
  export type QuizResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | QuizResult$userArgs<ExtArgs>
  }
  export type QuizResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | QuizResult$userArgs<ExtArgs>
  }
  export type QuizResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | QuizResult$userArgs<ExtArgs>
  }

  export type $QuizResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizResult"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      profileType: string
      score: number | null
      answers: Prisma.JsonValue
      averageResponseTime: number | null
      detailedResponseTimes: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["quizResult"]>
    composites: {}
  }

  type QuizResultGetPayload<S extends boolean | null | undefined | QuizResultDefaultArgs> = $Result.GetResult<Prisma.$QuizResultPayload, S>

  type QuizResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizResultCountAggregateInputType | true
    }

  export interface QuizResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizResult'], meta: { name: 'QuizResult' } }
    /**
     * Find zero or one QuizResult that matches the filter.
     * @param {QuizResultFindUniqueArgs} args - Arguments to find a QuizResult
     * @example
     * // Get one QuizResult
     * const quizResult = await prisma.quizResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizResultFindUniqueArgs>(args: SelectSubset<T, QuizResultFindUniqueArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizResultFindUniqueOrThrowArgs} args - Arguments to find a QuizResult
     * @example
     * // Get one QuizResult
     * const quizResult = await prisma.quizResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizResultFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultFindFirstArgs} args - Arguments to find a QuizResult
     * @example
     * // Get one QuizResult
     * const quizResult = await prisma.quizResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizResultFindFirstArgs>(args?: SelectSubset<T, QuizResultFindFirstArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultFindFirstOrThrowArgs} args - Arguments to find a QuizResult
     * @example
     * // Get one QuizResult
     * const quizResult = await prisma.quizResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizResultFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizResults
     * const quizResults = await prisma.quizResult.findMany()
     * 
     * // Get first 10 QuizResults
     * const quizResults = await prisma.quizResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizResultWithIdOnly = await prisma.quizResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizResultFindManyArgs>(args?: SelectSubset<T, QuizResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizResult.
     * @param {QuizResultCreateArgs} args - Arguments to create a QuizResult.
     * @example
     * // Create one QuizResult
     * const QuizResult = await prisma.quizResult.create({
     *   data: {
     *     // ... data to create a QuizResult
     *   }
     * })
     * 
     */
    create<T extends QuizResultCreateArgs>(args: SelectSubset<T, QuizResultCreateArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizResults.
     * @param {QuizResultCreateManyArgs} args - Arguments to create many QuizResults.
     * @example
     * // Create many QuizResults
     * const quizResult = await prisma.quizResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizResultCreateManyArgs>(args?: SelectSubset<T, QuizResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizResults and returns the data saved in the database.
     * @param {QuizResultCreateManyAndReturnArgs} args - Arguments to create many QuizResults.
     * @example
     * // Create many QuizResults
     * const quizResult = await prisma.quizResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizResults and only return the `id`
     * const quizResultWithIdOnly = await prisma.quizResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizResultCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizResult.
     * @param {QuizResultDeleteArgs} args - Arguments to delete one QuizResult.
     * @example
     * // Delete one QuizResult
     * const QuizResult = await prisma.quizResult.delete({
     *   where: {
     *     // ... filter to delete one QuizResult
     *   }
     * })
     * 
     */
    delete<T extends QuizResultDeleteArgs>(args: SelectSubset<T, QuizResultDeleteArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizResult.
     * @param {QuizResultUpdateArgs} args - Arguments to update one QuizResult.
     * @example
     * // Update one QuizResult
     * const quizResult = await prisma.quizResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizResultUpdateArgs>(args: SelectSubset<T, QuizResultUpdateArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizResults.
     * @param {QuizResultDeleteManyArgs} args - Arguments to filter QuizResults to delete.
     * @example
     * // Delete a few QuizResults
     * const { count } = await prisma.quizResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizResultDeleteManyArgs>(args?: SelectSubset<T, QuizResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizResults
     * const quizResult = await prisma.quizResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizResultUpdateManyArgs>(args: SelectSubset<T, QuizResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizResults and returns the data updated in the database.
     * @param {QuizResultUpdateManyAndReturnArgs} args - Arguments to update many QuizResults.
     * @example
     * // Update many QuizResults
     * const quizResult = await prisma.quizResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizResults and only return the `id`
     * const quizResultWithIdOnly = await prisma.quizResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuizResultUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizResult.
     * @param {QuizResultUpsertArgs} args - Arguments to update or create a QuizResult.
     * @example
     * // Update or create a QuizResult
     * const quizResult = await prisma.quizResult.upsert({
     *   create: {
     *     // ... data to create a QuizResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizResult we want to update
     *   }
     * })
     */
    upsert<T extends QuizResultUpsertArgs>(args: SelectSubset<T, QuizResultUpsertArgs<ExtArgs>>): Prisma__QuizResultClient<$Result.GetResult<Prisma.$QuizResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultCountArgs} args - Arguments to filter QuizResults to count.
     * @example
     * // Count the number of QuizResults
     * const count = await prisma.quizResult.count({
     *   where: {
     *     // ... the filter for the QuizResults we want to count
     *   }
     * })
    **/
    count<T extends QuizResultCountArgs>(
      args?: Subset<T, QuizResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizResultAggregateArgs>(args: Subset<T, QuizResultAggregateArgs>): Prisma.PrismaPromise<GetQuizResultAggregateType<T>>

    /**
     * Group by QuizResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizResultGroupByArgs} args - Group by arguments.
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
      T extends QuizResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizResultGroupByArgs['orderBy'] }
        : { orderBy?: QuizResultGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizResult model
   */
  readonly fields: QuizResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends QuizResult$userArgs<ExtArgs> = {}>(args?: Subset<T, QuizResult$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the QuizResult model
   */
  interface QuizResultFieldRefs {
    readonly id: FieldRef<"QuizResult", 'String'>
    readonly userId: FieldRef<"QuizResult", 'String'>
    readonly profileType: FieldRef<"QuizResult", 'String'>
    readonly score: FieldRef<"QuizResult", 'Int'>
    readonly answers: FieldRef<"QuizResult", 'Json'>
    readonly averageResponseTime: FieldRef<"QuizResult", 'Int'>
    readonly detailedResponseTimes: FieldRef<"QuizResult", 'Json'>
    readonly createdAt: FieldRef<"QuizResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuizResult findUnique
   */
  export type QuizResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * Filter, which QuizResult to fetch.
     */
    where: QuizResultWhereUniqueInput
  }

  /**
   * QuizResult findUniqueOrThrow
   */
  export type QuizResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * Filter, which QuizResult to fetch.
     */
    where: QuizResultWhereUniqueInput
  }

  /**
   * QuizResult findFirst
   */
  export type QuizResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * Filter, which QuizResult to fetch.
     */
    where?: QuizResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizResults to fetch.
     */
    orderBy?: QuizResultOrderByWithRelationInput | QuizResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizResults.
     */
    cursor?: QuizResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizResults.
     */
    distinct?: QuizResultScalarFieldEnum | QuizResultScalarFieldEnum[]
  }

  /**
   * QuizResult findFirstOrThrow
   */
  export type QuizResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * Filter, which QuizResult to fetch.
     */
    where?: QuizResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizResults to fetch.
     */
    orderBy?: QuizResultOrderByWithRelationInput | QuizResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizResults.
     */
    cursor?: QuizResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizResults.
     */
    distinct?: QuizResultScalarFieldEnum | QuizResultScalarFieldEnum[]
  }

  /**
   * QuizResult findMany
   */
  export type QuizResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * Filter, which QuizResults to fetch.
     */
    where?: QuizResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizResults to fetch.
     */
    orderBy?: QuizResultOrderByWithRelationInput | QuizResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizResults.
     */
    cursor?: QuizResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizResults.
     */
    distinct?: QuizResultScalarFieldEnum | QuizResultScalarFieldEnum[]
  }

  /**
   * QuizResult create
   */
  export type QuizResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizResult.
     */
    data: XOR<QuizResultCreateInput, QuizResultUncheckedCreateInput>
  }

  /**
   * QuizResult createMany
   */
  export type QuizResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizResults.
     */
    data: QuizResultCreateManyInput | QuizResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizResult createManyAndReturn
   */
  export type QuizResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * The data used to create many QuizResults.
     */
    data: QuizResultCreateManyInput | QuizResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizResult update
   */
  export type QuizResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizResult.
     */
    data: XOR<QuizResultUpdateInput, QuizResultUncheckedUpdateInput>
    /**
     * Choose, which QuizResult to update.
     */
    where: QuizResultWhereUniqueInput
  }

  /**
   * QuizResult updateMany
   */
  export type QuizResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizResults.
     */
    data: XOR<QuizResultUpdateManyMutationInput, QuizResultUncheckedUpdateManyInput>
    /**
     * Filter which QuizResults to update
     */
    where?: QuizResultWhereInput
    /**
     * Limit how many QuizResults to update.
     */
    limit?: number
  }

  /**
   * QuizResult updateManyAndReturn
   */
  export type QuizResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * The data used to update QuizResults.
     */
    data: XOR<QuizResultUpdateManyMutationInput, QuizResultUncheckedUpdateManyInput>
    /**
     * Filter which QuizResults to update
     */
    where?: QuizResultWhereInput
    /**
     * Limit how many QuizResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizResult upsert
   */
  export type QuizResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizResult to update in case it exists.
     */
    where: QuizResultWhereUniqueInput
    /**
     * In case the QuizResult found by the `where` argument doesn't exist, create a new QuizResult with this data.
     */
    create: XOR<QuizResultCreateInput, QuizResultUncheckedCreateInput>
    /**
     * In case the QuizResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizResultUpdateInput, QuizResultUncheckedUpdateInput>
  }

  /**
   * QuizResult delete
   */
  export type QuizResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
    /**
     * Filter which QuizResult to delete.
     */
    where: QuizResultWhereUniqueInput
  }

  /**
   * QuizResult deleteMany
   */
  export type QuizResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizResults to delete
     */
    where?: QuizResultWhereInput
    /**
     * Limit how many QuizResults to delete.
     */
    limit?: number
  }

  /**
   * QuizResult.user
   */
  export type QuizResult$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * QuizResult without action
   */
  export type QuizResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizResult
     */
    select?: QuizResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizResult
     */
    omit?: QuizResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizResultInclude<ExtArgs> | null
  }


  /**
   * Model MissionSubmission
   */

  export type AggregateMissionSubmission = {
    _count: MissionSubmissionCountAggregateOutputType | null
    _avg: MissionSubmissionAvgAggregateOutputType | null
    _sum: MissionSubmissionSumAggregateOutputType | null
    _min: MissionSubmissionMinAggregateOutputType | null
    _max: MissionSubmissionMaxAggregateOutputType | null
  }

  export type MissionSubmissionAvgAggregateOutputType = {
    userDifficulty: number | null
    userRating: number | null
    xpAwarded: number | null
  }

  export type MissionSubmissionSumAggregateOutputType = {
    userDifficulty: number | null
    userRating: number | null
    xpAwarded: number | null
  }

  export type MissionSubmissionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    missionId: string | null
    status: string | null
    content: string | null
    projectDescription: string | null
    userDifficulty: number | null
    userRating: number | null
    userFeedback: string | null
    improvementSuggestions: string | null
    reviewerFeedback: string | null
    xpAwarded: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MissionSubmissionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    missionId: string | null
    status: string | null
    content: string | null
    projectDescription: string | null
    userDifficulty: number | null
    userRating: number | null
    userFeedback: string | null
    improvementSuggestions: string | null
    reviewerFeedback: string | null
    xpAwarded: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MissionSubmissionCountAggregateOutputType = {
    id: number
    userId: number
    missionId: number
    status: number
    content: number
    projectDescription: number
    userDifficulty: number
    userRating: number
    userFeedback: number
    improvementSuggestions: number
    reviewerFeedback: number
    xpAwarded: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MissionSubmissionAvgAggregateInputType = {
    userDifficulty?: true
    userRating?: true
    xpAwarded?: true
  }

  export type MissionSubmissionSumAggregateInputType = {
    userDifficulty?: true
    userRating?: true
    xpAwarded?: true
  }

  export type MissionSubmissionMinAggregateInputType = {
    id?: true
    userId?: true
    missionId?: true
    status?: true
    content?: true
    projectDescription?: true
    userDifficulty?: true
    userRating?: true
    userFeedback?: true
    improvementSuggestions?: true
    reviewerFeedback?: true
    xpAwarded?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MissionSubmissionMaxAggregateInputType = {
    id?: true
    userId?: true
    missionId?: true
    status?: true
    content?: true
    projectDescription?: true
    userDifficulty?: true
    userRating?: true
    userFeedback?: true
    improvementSuggestions?: true
    reviewerFeedback?: true
    xpAwarded?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MissionSubmissionCountAggregateInputType = {
    id?: true
    userId?: true
    missionId?: true
    status?: true
    content?: true
    projectDescription?: true
    userDifficulty?: true
    userRating?: true
    userFeedback?: true
    improvementSuggestions?: true
    reviewerFeedback?: true
    xpAwarded?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MissionSubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MissionSubmission to aggregate.
     */
    where?: MissionSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionSubmissions to fetch.
     */
    orderBy?: MissionSubmissionOrderByWithRelationInput | MissionSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MissionSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MissionSubmissions
    **/
    _count?: true | MissionSubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MissionSubmissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MissionSubmissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MissionSubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MissionSubmissionMaxAggregateInputType
  }

  export type GetMissionSubmissionAggregateType<T extends MissionSubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateMissionSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMissionSubmission[P]>
      : GetScalarType<T[P], AggregateMissionSubmission[P]>
  }




  export type MissionSubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MissionSubmissionWhereInput
    orderBy?: MissionSubmissionOrderByWithAggregationInput | MissionSubmissionOrderByWithAggregationInput[]
    by: MissionSubmissionScalarFieldEnum[] | MissionSubmissionScalarFieldEnum
    having?: MissionSubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MissionSubmissionCountAggregateInputType | true
    _avg?: MissionSubmissionAvgAggregateInputType
    _sum?: MissionSubmissionSumAggregateInputType
    _min?: MissionSubmissionMinAggregateInputType
    _max?: MissionSubmissionMaxAggregateInputType
  }

  export type MissionSubmissionGroupByOutputType = {
    id: string
    userId: string
    missionId: string
    status: string
    content: string | null
    projectDescription: string | null
    userDifficulty: number | null
    userRating: number | null
    userFeedback: string | null
    improvementSuggestions: string | null
    reviewerFeedback: string | null
    xpAwarded: number
    createdAt: Date
    updatedAt: Date
    _count: MissionSubmissionCountAggregateOutputType | null
    _avg: MissionSubmissionAvgAggregateOutputType | null
    _sum: MissionSubmissionSumAggregateOutputType | null
    _min: MissionSubmissionMinAggregateOutputType | null
    _max: MissionSubmissionMaxAggregateOutputType | null
  }

  type GetMissionSubmissionGroupByPayload<T extends MissionSubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MissionSubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MissionSubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MissionSubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], MissionSubmissionGroupByOutputType[P]>
        }
      >
    >


  export type MissionSubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    missionId?: boolean
    status?: boolean
    content?: boolean
    projectDescription?: boolean
    userDifficulty?: boolean
    userRating?: boolean
    userFeedback?: boolean
    improvementSuggestions?: boolean
    reviewerFeedback?: boolean
    xpAwarded?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    mission?: boolean | MissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["missionSubmission"]>

  export type MissionSubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    missionId?: boolean
    status?: boolean
    content?: boolean
    projectDescription?: boolean
    userDifficulty?: boolean
    userRating?: boolean
    userFeedback?: boolean
    improvementSuggestions?: boolean
    reviewerFeedback?: boolean
    xpAwarded?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    mission?: boolean | MissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["missionSubmission"]>

  export type MissionSubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    missionId?: boolean
    status?: boolean
    content?: boolean
    projectDescription?: boolean
    userDifficulty?: boolean
    userRating?: boolean
    userFeedback?: boolean
    improvementSuggestions?: boolean
    reviewerFeedback?: boolean
    xpAwarded?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    mission?: boolean | MissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["missionSubmission"]>

  export type MissionSubmissionSelectScalar = {
    id?: boolean
    userId?: boolean
    missionId?: boolean
    status?: boolean
    content?: boolean
    projectDescription?: boolean
    userDifficulty?: boolean
    userRating?: boolean
    userFeedback?: boolean
    improvementSuggestions?: boolean
    reviewerFeedback?: boolean
    xpAwarded?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MissionSubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "missionId" | "status" | "content" | "projectDescription" | "userDifficulty" | "userRating" | "userFeedback" | "improvementSuggestions" | "reviewerFeedback" | "xpAwarded" | "createdAt" | "updatedAt", ExtArgs["result"]["missionSubmission"]>
  export type MissionSubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    mission?: boolean | MissionDefaultArgs<ExtArgs>
  }
  export type MissionSubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    mission?: boolean | MissionDefaultArgs<ExtArgs>
  }
  export type MissionSubmissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    mission?: boolean | MissionDefaultArgs<ExtArgs>
  }

  export type $MissionSubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MissionSubmission"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      mission: Prisma.$MissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      missionId: string
      status: string
      content: string | null
      projectDescription: string | null
      userDifficulty: number | null
      userRating: number | null
      userFeedback: string | null
      improvementSuggestions: string | null
      reviewerFeedback: string | null
      xpAwarded: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["missionSubmission"]>
    composites: {}
  }

  type MissionSubmissionGetPayload<S extends boolean | null | undefined | MissionSubmissionDefaultArgs> = $Result.GetResult<Prisma.$MissionSubmissionPayload, S>

  type MissionSubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MissionSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MissionSubmissionCountAggregateInputType | true
    }

  export interface MissionSubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MissionSubmission'], meta: { name: 'MissionSubmission' } }
    /**
     * Find zero or one MissionSubmission that matches the filter.
     * @param {MissionSubmissionFindUniqueArgs} args - Arguments to find a MissionSubmission
     * @example
     * // Get one MissionSubmission
     * const missionSubmission = await prisma.missionSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MissionSubmissionFindUniqueArgs>(args: SelectSubset<T, MissionSubmissionFindUniqueArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MissionSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MissionSubmissionFindUniqueOrThrowArgs} args - Arguments to find a MissionSubmission
     * @example
     * // Get one MissionSubmission
     * const missionSubmission = await prisma.missionSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MissionSubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, MissionSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MissionSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionFindFirstArgs} args - Arguments to find a MissionSubmission
     * @example
     * // Get one MissionSubmission
     * const missionSubmission = await prisma.missionSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MissionSubmissionFindFirstArgs>(args?: SelectSubset<T, MissionSubmissionFindFirstArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MissionSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionFindFirstOrThrowArgs} args - Arguments to find a MissionSubmission
     * @example
     * // Get one MissionSubmission
     * const missionSubmission = await prisma.missionSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MissionSubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, MissionSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MissionSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MissionSubmissions
     * const missionSubmissions = await prisma.missionSubmission.findMany()
     * 
     * // Get first 10 MissionSubmissions
     * const missionSubmissions = await prisma.missionSubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const missionSubmissionWithIdOnly = await prisma.missionSubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MissionSubmissionFindManyArgs>(args?: SelectSubset<T, MissionSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MissionSubmission.
     * @param {MissionSubmissionCreateArgs} args - Arguments to create a MissionSubmission.
     * @example
     * // Create one MissionSubmission
     * const MissionSubmission = await prisma.missionSubmission.create({
     *   data: {
     *     // ... data to create a MissionSubmission
     *   }
     * })
     * 
     */
    create<T extends MissionSubmissionCreateArgs>(args: SelectSubset<T, MissionSubmissionCreateArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MissionSubmissions.
     * @param {MissionSubmissionCreateManyArgs} args - Arguments to create many MissionSubmissions.
     * @example
     * // Create many MissionSubmissions
     * const missionSubmission = await prisma.missionSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MissionSubmissionCreateManyArgs>(args?: SelectSubset<T, MissionSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MissionSubmissions and returns the data saved in the database.
     * @param {MissionSubmissionCreateManyAndReturnArgs} args - Arguments to create many MissionSubmissions.
     * @example
     * // Create many MissionSubmissions
     * const missionSubmission = await prisma.missionSubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MissionSubmissions and only return the `id`
     * const missionSubmissionWithIdOnly = await prisma.missionSubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MissionSubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, MissionSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MissionSubmission.
     * @param {MissionSubmissionDeleteArgs} args - Arguments to delete one MissionSubmission.
     * @example
     * // Delete one MissionSubmission
     * const MissionSubmission = await prisma.missionSubmission.delete({
     *   where: {
     *     // ... filter to delete one MissionSubmission
     *   }
     * })
     * 
     */
    delete<T extends MissionSubmissionDeleteArgs>(args: SelectSubset<T, MissionSubmissionDeleteArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MissionSubmission.
     * @param {MissionSubmissionUpdateArgs} args - Arguments to update one MissionSubmission.
     * @example
     * // Update one MissionSubmission
     * const missionSubmission = await prisma.missionSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MissionSubmissionUpdateArgs>(args: SelectSubset<T, MissionSubmissionUpdateArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MissionSubmissions.
     * @param {MissionSubmissionDeleteManyArgs} args - Arguments to filter MissionSubmissions to delete.
     * @example
     * // Delete a few MissionSubmissions
     * const { count } = await prisma.missionSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MissionSubmissionDeleteManyArgs>(args?: SelectSubset<T, MissionSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MissionSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MissionSubmissions
     * const missionSubmission = await prisma.missionSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MissionSubmissionUpdateManyArgs>(args: SelectSubset<T, MissionSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MissionSubmissions and returns the data updated in the database.
     * @param {MissionSubmissionUpdateManyAndReturnArgs} args - Arguments to update many MissionSubmissions.
     * @example
     * // Update many MissionSubmissions
     * const missionSubmission = await prisma.missionSubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MissionSubmissions and only return the `id`
     * const missionSubmissionWithIdOnly = await prisma.missionSubmission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MissionSubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, MissionSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MissionSubmission.
     * @param {MissionSubmissionUpsertArgs} args - Arguments to update or create a MissionSubmission.
     * @example
     * // Update or create a MissionSubmission
     * const missionSubmission = await prisma.missionSubmission.upsert({
     *   create: {
     *     // ... data to create a MissionSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MissionSubmission we want to update
     *   }
     * })
     */
    upsert<T extends MissionSubmissionUpsertArgs>(args: SelectSubset<T, MissionSubmissionUpsertArgs<ExtArgs>>): Prisma__MissionSubmissionClient<$Result.GetResult<Prisma.$MissionSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MissionSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionCountArgs} args - Arguments to filter MissionSubmissions to count.
     * @example
     * // Count the number of MissionSubmissions
     * const count = await prisma.missionSubmission.count({
     *   where: {
     *     // ... the filter for the MissionSubmissions we want to count
     *   }
     * })
    **/
    count<T extends MissionSubmissionCountArgs>(
      args?: Subset<T, MissionSubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MissionSubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MissionSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MissionSubmissionAggregateArgs>(args: Subset<T, MissionSubmissionAggregateArgs>): Prisma.PrismaPromise<GetMissionSubmissionAggregateType<T>>

    /**
     * Group by MissionSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionSubmissionGroupByArgs} args - Group by arguments.
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
      T extends MissionSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MissionSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: MissionSubmissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MissionSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMissionSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MissionSubmission model
   */
  readonly fields: MissionSubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MissionSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MissionSubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    mission<T extends MissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MissionDefaultArgs<ExtArgs>>): Prisma__MissionClient<$Result.GetResult<Prisma.$MissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MissionSubmission model
   */
  interface MissionSubmissionFieldRefs {
    readonly id: FieldRef<"MissionSubmission", 'String'>
    readonly userId: FieldRef<"MissionSubmission", 'String'>
    readonly missionId: FieldRef<"MissionSubmission", 'String'>
    readonly status: FieldRef<"MissionSubmission", 'String'>
    readonly content: FieldRef<"MissionSubmission", 'String'>
    readonly projectDescription: FieldRef<"MissionSubmission", 'String'>
    readonly userDifficulty: FieldRef<"MissionSubmission", 'Int'>
    readonly userRating: FieldRef<"MissionSubmission", 'Int'>
    readonly userFeedback: FieldRef<"MissionSubmission", 'String'>
    readonly improvementSuggestions: FieldRef<"MissionSubmission", 'String'>
    readonly reviewerFeedback: FieldRef<"MissionSubmission", 'String'>
    readonly xpAwarded: FieldRef<"MissionSubmission", 'Int'>
    readonly createdAt: FieldRef<"MissionSubmission", 'DateTime'>
    readonly updatedAt: FieldRef<"MissionSubmission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MissionSubmission findUnique
   */
  export type MissionSubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which MissionSubmission to fetch.
     */
    where: MissionSubmissionWhereUniqueInput
  }

  /**
   * MissionSubmission findUniqueOrThrow
   */
  export type MissionSubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which MissionSubmission to fetch.
     */
    where: MissionSubmissionWhereUniqueInput
  }

  /**
   * MissionSubmission findFirst
   */
  export type MissionSubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which MissionSubmission to fetch.
     */
    where?: MissionSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionSubmissions to fetch.
     */
    orderBy?: MissionSubmissionOrderByWithRelationInput | MissionSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MissionSubmissions.
     */
    cursor?: MissionSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MissionSubmissions.
     */
    distinct?: MissionSubmissionScalarFieldEnum | MissionSubmissionScalarFieldEnum[]
  }

  /**
   * MissionSubmission findFirstOrThrow
   */
  export type MissionSubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which MissionSubmission to fetch.
     */
    where?: MissionSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionSubmissions to fetch.
     */
    orderBy?: MissionSubmissionOrderByWithRelationInput | MissionSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MissionSubmissions.
     */
    cursor?: MissionSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MissionSubmissions.
     */
    distinct?: MissionSubmissionScalarFieldEnum | MissionSubmissionScalarFieldEnum[]
  }

  /**
   * MissionSubmission findMany
   */
  export type MissionSubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which MissionSubmissions to fetch.
     */
    where?: MissionSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionSubmissions to fetch.
     */
    orderBy?: MissionSubmissionOrderByWithRelationInput | MissionSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MissionSubmissions.
     */
    cursor?: MissionSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MissionSubmissions.
     */
    distinct?: MissionSubmissionScalarFieldEnum | MissionSubmissionScalarFieldEnum[]
  }

  /**
   * MissionSubmission create
   */
  export type MissionSubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a MissionSubmission.
     */
    data: XOR<MissionSubmissionCreateInput, MissionSubmissionUncheckedCreateInput>
  }

  /**
   * MissionSubmission createMany
   */
  export type MissionSubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MissionSubmissions.
     */
    data: MissionSubmissionCreateManyInput | MissionSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MissionSubmission createManyAndReturn
   */
  export type MissionSubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many MissionSubmissions.
     */
    data: MissionSubmissionCreateManyInput | MissionSubmissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MissionSubmission update
   */
  export type MissionSubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a MissionSubmission.
     */
    data: XOR<MissionSubmissionUpdateInput, MissionSubmissionUncheckedUpdateInput>
    /**
     * Choose, which MissionSubmission to update.
     */
    where: MissionSubmissionWhereUniqueInput
  }

  /**
   * MissionSubmission updateMany
   */
  export type MissionSubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MissionSubmissions.
     */
    data: XOR<MissionSubmissionUpdateManyMutationInput, MissionSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which MissionSubmissions to update
     */
    where?: MissionSubmissionWhereInput
    /**
     * Limit how many MissionSubmissions to update.
     */
    limit?: number
  }

  /**
   * MissionSubmission updateManyAndReturn
   */
  export type MissionSubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * The data used to update MissionSubmissions.
     */
    data: XOR<MissionSubmissionUpdateManyMutationInput, MissionSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which MissionSubmissions to update
     */
    where?: MissionSubmissionWhereInput
    /**
     * Limit how many MissionSubmissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MissionSubmission upsert
   */
  export type MissionSubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the MissionSubmission to update in case it exists.
     */
    where: MissionSubmissionWhereUniqueInput
    /**
     * In case the MissionSubmission found by the `where` argument doesn't exist, create a new MissionSubmission with this data.
     */
    create: XOR<MissionSubmissionCreateInput, MissionSubmissionUncheckedCreateInput>
    /**
     * In case the MissionSubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MissionSubmissionUpdateInput, MissionSubmissionUncheckedUpdateInput>
  }

  /**
   * MissionSubmission delete
   */
  export type MissionSubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
    /**
     * Filter which MissionSubmission to delete.
     */
    where: MissionSubmissionWhereUniqueInput
  }

  /**
   * MissionSubmission deleteMany
   */
  export type MissionSubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MissionSubmissions to delete
     */
    where?: MissionSubmissionWhereInput
    /**
     * Limit how many MissionSubmissions to delete.
     */
    limit?: number
  }

  /**
   * MissionSubmission without action
   */
  export type MissionSubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionSubmission
     */
    select?: MissionSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionSubmission
     */
    omit?: MissionSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionSubmissionInclude<ExtArgs> | null
  }


  /**
   * Model ContactMessage
   */

  export type AggregateContactMessage = {
    _count: ContactMessageCountAggregateOutputType | null
    _min: ContactMessageMinAggregateOutputType | null
    _max: ContactMessageMaxAggregateOutputType | null
  }

  export type ContactMessageMinAggregateOutputType = {
    id: string | null
    type: string | null
    email: string | null
    subject: string | null
    content: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ContactMessageMaxAggregateOutputType = {
    id: string | null
    type: string | null
    email: string | null
    subject: string | null
    content: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ContactMessageCountAggregateOutputType = {
    id: number
    type: number
    email: number
    subject: number
    content: number
    status: number
    createdAt: number
    _all: number
  }


  export type ContactMessageMinAggregateInputType = {
    id?: true
    type?: true
    email?: true
    subject?: true
    content?: true
    status?: true
    createdAt?: true
  }

  export type ContactMessageMaxAggregateInputType = {
    id?: true
    type?: true
    email?: true
    subject?: true
    content?: true
    status?: true
    createdAt?: true
  }

  export type ContactMessageCountAggregateInputType = {
    id?: true
    type?: true
    email?: true
    subject?: true
    content?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ContactMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactMessage to aggregate.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContactMessages
    **/
    _count?: true | ContactMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContactMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContactMessageMaxAggregateInputType
  }

  export type GetContactMessageAggregateType<T extends ContactMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateContactMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContactMessage[P]>
      : GetScalarType<T[P], AggregateContactMessage[P]>
  }




  export type ContactMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContactMessageWhereInput
    orderBy?: ContactMessageOrderByWithAggregationInput | ContactMessageOrderByWithAggregationInput[]
    by: ContactMessageScalarFieldEnum[] | ContactMessageScalarFieldEnum
    having?: ContactMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContactMessageCountAggregateInputType | true
    _min?: ContactMessageMinAggregateInputType
    _max?: ContactMessageMaxAggregateInputType
  }

  export type ContactMessageGroupByOutputType = {
    id: string
    type: string
    email: string
    subject: string
    content: string
    status: string
    createdAt: Date
    _count: ContactMessageCountAggregateOutputType | null
    _min: ContactMessageMinAggregateOutputType | null
    _max: ContactMessageMaxAggregateOutputType | null
  }

  type GetContactMessageGroupByPayload<T extends ContactMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContactMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContactMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContactMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ContactMessageGroupByOutputType[P]>
        }
      >
    >


  export type ContactMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    email?: boolean
    subject?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>

  export type ContactMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    email?: boolean
    subject?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>

  export type ContactMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    email?: boolean
    subject?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["contactMessage"]>

  export type ContactMessageSelectScalar = {
    id?: boolean
    type?: boolean
    email?: boolean
    subject?: boolean
    content?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type ContactMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "email" | "subject" | "content" | "status" | "createdAt", ExtArgs["result"]["contactMessage"]>

  export type $ContactMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContactMessage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      email: string
      subject: string
      content: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["contactMessage"]>
    composites: {}
  }

  type ContactMessageGetPayload<S extends boolean | null | undefined | ContactMessageDefaultArgs> = $Result.GetResult<Prisma.$ContactMessagePayload, S>

  type ContactMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContactMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContactMessageCountAggregateInputType | true
    }

  export interface ContactMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContactMessage'], meta: { name: 'ContactMessage' } }
    /**
     * Find zero or one ContactMessage that matches the filter.
     * @param {ContactMessageFindUniqueArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContactMessageFindUniqueArgs>(args: SelectSubset<T, ContactMessageFindUniqueArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContactMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContactMessageFindUniqueOrThrowArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContactMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ContactMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindFirstArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContactMessageFindFirstArgs>(args?: SelectSubset<T, ContactMessageFindFirstArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContactMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindFirstOrThrowArgs} args - Arguments to find a ContactMessage
     * @example
     * // Get one ContactMessage
     * const contactMessage = await prisma.contactMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContactMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ContactMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContactMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContactMessages
     * const contactMessages = await prisma.contactMessage.findMany()
     * 
     * // Get first 10 ContactMessages
     * const contactMessages = await prisma.contactMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContactMessageFindManyArgs>(args?: SelectSubset<T, ContactMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContactMessage.
     * @param {ContactMessageCreateArgs} args - Arguments to create a ContactMessage.
     * @example
     * // Create one ContactMessage
     * const ContactMessage = await prisma.contactMessage.create({
     *   data: {
     *     // ... data to create a ContactMessage
     *   }
     * })
     * 
     */
    create<T extends ContactMessageCreateArgs>(args: SelectSubset<T, ContactMessageCreateArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContactMessages.
     * @param {ContactMessageCreateManyArgs} args - Arguments to create many ContactMessages.
     * @example
     * // Create many ContactMessages
     * const contactMessage = await prisma.contactMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContactMessageCreateManyArgs>(args?: SelectSubset<T, ContactMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContactMessages and returns the data saved in the database.
     * @param {ContactMessageCreateManyAndReturnArgs} args - Arguments to create many ContactMessages.
     * @example
     * // Create many ContactMessages
     * const contactMessage = await prisma.contactMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContactMessages and only return the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContactMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ContactMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContactMessage.
     * @param {ContactMessageDeleteArgs} args - Arguments to delete one ContactMessage.
     * @example
     * // Delete one ContactMessage
     * const ContactMessage = await prisma.contactMessage.delete({
     *   where: {
     *     // ... filter to delete one ContactMessage
     *   }
     * })
     * 
     */
    delete<T extends ContactMessageDeleteArgs>(args: SelectSubset<T, ContactMessageDeleteArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContactMessage.
     * @param {ContactMessageUpdateArgs} args - Arguments to update one ContactMessage.
     * @example
     * // Update one ContactMessage
     * const contactMessage = await prisma.contactMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContactMessageUpdateArgs>(args: SelectSubset<T, ContactMessageUpdateArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContactMessages.
     * @param {ContactMessageDeleteManyArgs} args - Arguments to filter ContactMessages to delete.
     * @example
     * // Delete a few ContactMessages
     * const { count } = await prisma.contactMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContactMessageDeleteManyArgs>(args?: SelectSubset<T, ContactMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContactMessages
     * const contactMessage = await prisma.contactMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContactMessageUpdateManyArgs>(args: SelectSubset<T, ContactMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContactMessages and returns the data updated in the database.
     * @param {ContactMessageUpdateManyAndReturnArgs} args - Arguments to update many ContactMessages.
     * @example
     * // Update many ContactMessages
     * const contactMessage = await prisma.contactMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContactMessages and only return the `id`
     * const contactMessageWithIdOnly = await prisma.contactMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContactMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ContactMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContactMessage.
     * @param {ContactMessageUpsertArgs} args - Arguments to update or create a ContactMessage.
     * @example
     * // Update or create a ContactMessage
     * const contactMessage = await prisma.contactMessage.upsert({
     *   create: {
     *     // ... data to create a ContactMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContactMessage we want to update
     *   }
     * })
     */
    upsert<T extends ContactMessageUpsertArgs>(args: SelectSubset<T, ContactMessageUpsertArgs<ExtArgs>>): Prisma__ContactMessageClient<$Result.GetResult<Prisma.$ContactMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContactMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageCountArgs} args - Arguments to filter ContactMessages to count.
     * @example
     * // Count the number of ContactMessages
     * const count = await prisma.contactMessage.count({
     *   where: {
     *     // ... the filter for the ContactMessages we want to count
     *   }
     * })
    **/
    count<T extends ContactMessageCountArgs>(
      args?: Subset<T, ContactMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContactMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContactMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContactMessageAggregateArgs>(args: Subset<T, ContactMessageAggregateArgs>): Prisma.PrismaPromise<GetContactMessageAggregateType<T>>

    /**
     * Group by ContactMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContactMessageGroupByArgs} args - Group by arguments.
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
      T extends ContactMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContactMessageGroupByArgs['orderBy'] }
        : { orderBy?: ContactMessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContactMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContactMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContactMessage model
   */
  readonly fields: ContactMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContactMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContactMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ContactMessage model
   */
  interface ContactMessageFieldRefs {
    readonly id: FieldRef<"ContactMessage", 'String'>
    readonly type: FieldRef<"ContactMessage", 'String'>
    readonly email: FieldRef<"ContactMessage", 'String'>
    readonly subject: FieldRef<"ContactMessage", 'String'>
    readonly content: FieldRef<"ContactMessage", 'String'>
    readonly status: FieldRef<"ContactMessage", 'String'>
    readonly createdAt: FieldRef<"ContactMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContactMessage findUnique
   */
  export type ContactMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage findUniqueOrThrow
   */
  export type ContactMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage findFirst
   */
  export type ContactMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage findFirstOrThrow
   */
  export type ContactMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessage to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage findMany
   */
  export type ContactMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter, which ContactMessages to fetch.
     */
    where?: ContactMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContactMessages to fetch.
     */
    orderBy?: ContactMessageOrderByWithRelationInput | ContactMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContactMessages.
     */
    cursor?: ContactMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContactMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContactMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContactMessages.
     */
    distinct?: ContactMessageScalarFieldEnum | ContactMessageScalarFieldEnum[]
  }

  /**
   * ContactMessage create
   */
  export type ContactMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data needed to create a ContactMessage.
     */
    data: XOR<ContactMessageCreateInput, ContactMessageUncheckedCreateInput>
  }

  /**
   * ContactMessage createMany
   */
  export type ContactMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContactMessages.
     */
    data: ContactMessageCreateManyInput | ContactMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactMessage createManyAndReturn
   */
  export type ContactMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ContactMessages.
     */
    data: ContactMessageCreateManyInput | ContactMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContactMessage update
   */
  export type ContactMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data needed to update a ContactMessage.
     */
    data: XOR<ContactMessageUpdateInput, ContactMessageUncheckedUpdateInput>
    /**
     * Choose, which ContactMessage to update.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage updateMany
   */
  export type ContactMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContactMessages.
     */
    data: XOR<ContactMessageUpdateManyMutationInput, ContactMessageUncheckedUpdateManyInput>
    /**
     * Filter which ContactMessages to update
     */
    where?: ContactMessageWhereInput
    /**
     * Limit how many ContactMessages to update.
     */
    limit?: number
  }

  /**
   * ContactMessage updateManyAndReturn
   */
  export type ContactMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The data used to update ContactMessages.
     */
    data: XOR<ContactMessageUpdateManyMutationInput, ContactMessageUncheckedUpdateManyInput>
    /**
     * Filter which ContactMessages to update
     */
    where?: ContactMessageWhereInput
    /**
     * Limit how many ContactMessages to update.
     */
    limit?: number
  }

  /**
   * ContactMessage upsert
   */
  export type ContactMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * The filter to search for the ContactMessage to update in case it exists.
     */
    where: ContactMessageWhereUniqueInput
    /**
     * In case the ContactMessage found by the `where` argument doesn't exist, create a new ContactMessage with this data.
     */
    create: XOR<ContactMessageCreateInput, ContactMessageUncheckedCreateInput>
    /**
     * In case the ContactMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContactMessageUpdateInput, ContactMessageUncheckedUpdateInput>
  }

  /**
   * ContactMessage delete
   */
  export type ContactMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
    /**
     * Filter which ContactMessage to delete.
     */
    where: ContactMessageWhereUniqueInput
  }

  /**
   * ContactMessage deleteMany
   */
  export type ContactMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContactMessages to delete
     */
    where?: ContactMessageWhereInput
    /**
     * Limit how many ContactMessages to delete.
     */
    limit?: number
  }

  /**
   * ContactMessage without action
   */
  export type ContactMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContactMessage
     */
    select?: ContactMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContactMessage
     */
    omit?: ContactMessageOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    level: 'level',
    experience: 'experience',
    class: 'class',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    pseudo: 'pseudo',
    bio: 'bio',
    country: 'country',
    city: 'city',
    language: 'language',
    ageRange: 'ageRange',
    currentSituation: 'currentSituation',
    technicalLevel: 'technicalLevel',
    domains: 'domains',
    tools: 'tools',
    githubUrl: 'githubUrl',
    portfolioUrl: 'portfolioUrl',
    linkedinUrl: 'linkedinUrl',
    twitterUrl: 'twitterUrl',
    mainObjective: 'mainObjective',
    secondaryObjectives: 'secondaryObjectives',
    dominantMotivation: 'dominantMotivation',
    longTermObjective: 'longTermObjective',
    preferredRhythm: 'preferredRhythm',
    onboardingSpeed: 'onboardingSpeed',
    answerConsistency: 'answerConsistency',
    connectionFrequency: 'connectionFrequency',
    dashboardActivity: 'dashboardActivity',
    communityEngagement: 'communityEngagement',
    builderScore: 'builderScore',
    creatorScore: 'creatorScore',
    strategistScore: 'strategistScore',
    catalystScore: 'catalystScore',
    polarization: 'polarization',
    profileStability: 'profileStability',
    cohortsJoined: 'cohortsJoined',
    collaborativeProjects: 'collaborativeProjects',
    mentorId: 'mentorId',
    projectsRealized: 'projectsRealized',
    activePaths: 'activePaths',
    badges: 'badges',
    missionsCompletedCount: 'missionsCompletedCount',
    recommendedPath: 'recommendedPath',
    recommendedTools: 'recommendedTools',
    predictedEngagementScore: 'predictedEngagementScore',
    confidenceScore: 'confidenceScore',
    profileDrift: 'profileDrift',
    behavioralVibrancy: 'behavioralVibrancy',
    lastHypothesisUpdate: 'lastHypothesisUpdate'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MissionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    slug: 'slug',
    category: 'category',
    difficulty: 'difficulty',
    xp: 'xp',
    weightBuilder: 'weightBuilder',
    weightCreator: 'weightCreator',
    weightStrategist: 'weightStrategist',
    weightCatalyst: 'weightCatalyst',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MissionScalarFieldEnum = (typeof MissionScalarFieldEnum)[keyof typeof MissionScalarFieldEnum]


  export const GuildScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    slug: 'slug',
    requiredLevel: 'requiredLevel',
    isPrivate: 'isPrivate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GuildScalarFieldEnum = (typeof GuildScalarFieldEnum)[keyof typeof GuildScalarFieldEnum]


  export const GuildMemberScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    guildId: 'guildId',
    role: 'role',
    joinedAt: 'joinedAt'
  };

  export type GuildMemberScalarFieldEnum = (typeof GuildMemberScalarFieldEnum)[keyof typeof GuildMemberScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const QuizResultScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    profileType: 'profileType',
    score: 'score',
    answers: 'answers',
    averageResponseTime: 'averageResponseTime',
    detailedResponseTimes: 'detailedResponseTimes',
    createdAt: 'createdAt'
  };

  export type QuizResultScalarFieldEnum = (typeof QuizResultScalarFieldEnum)[keyof typeof QuizResultScalarFieldEnum]


  export const MissionSubmissionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    missionId: 'missionId',
    status: 'status',
    content: 'content',
    projectDescription: 'projectDescription',
    userDifficulty: 'userDifficulty',
    userRating: 'userRating',
    userFeedback: 'userFeedback',
    improvementSuggestions: 'improvementSuggestions',
    reviewerFeedback: 'reviewerFeedback',
    xpAwarded: 'xpAwarded',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MissionSubmissionScalarFieldEnum = (typeof MissionSubmissionScalarFieldEnum)[keyof typeof MissionSubmissionScalarFieldEnum]


  export const ContactMessageScalarFieldEnum: {
    id: 'id',
    type: 'type',
    email: 'email',
    subject: 'subject',
    content: 'content',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ContactMessageScalarFieldEnum = (typeof ContactMessageScalarFieldEnum)[keyof typeof ContactMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    experience?: IntFilter<"User"> | number
    class?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    pseudo?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    language?: StringFilter<"User"> | string
    ageRange?: StringNullableFilter<"User"> | string | null
    currentSituation?: StringNullableFilter<"User"> | string | null
    technicalLevel?: StringNullableFilter<"User"> | string | null
    domains?: StringNullableListFilter<"User">
    tools?: StringNullableListFilter<"User">
    githubUrl?: StringNullableFilter<"User"> | string | null
    portfolioUrl?: StringNullableFilter<"User"> | string | null
    linkedinUrl?: StringNullableFilter<"User"> | string | null
    twitterUrl?: StringNullableFilter<"User"> | string | null
    mainObjective?: StringNullableFilter<"User"> | string | null
    secondaryObjectives?: StringNullableListFilter<"User">
    dominantMotivation?: StringNullableFilter<"User"> | string | null
    longTermObjective?: StringNullableFilter<"User"> | string | null
    preferredRhythm?: StringNullableFilter<"User"> | string | null
    onboardingSpeed?: IntNullableFilter<"User"> | number | null
    answerConsistency?: FloatNullableFilter<"User"> | number | null
    connectionFrequency?: FloatNullableFilter<"User"> | number | null
    dashboardActivity?: FloatNullableFilter<"User"> | number | null
    communityEngagement?: FloatNullableFilter<"User"> | number | null
    builderScore?: IntFilter<"User"> | number
    creatorScore?: IntFilter<"User"> | number
    strategistScore?: IntFilter<"User"> | number
    catalystScore?: IntFilter<"User"> | number
    polarization?: FloatFilter<"User"> | number
    profileStability?: FloatFilter<"User"> | number
    cohortsJoined?: StringNullableListFilter<"User">
    collaborativeProjects?: StringNullableListFilter<"User">
    mentorId?: StringNullableFilter<"User"> | string | null
    projectsRealized?: StringNullableListFilter<"User">
    activePaths?: StringNullableListFilter<"User">
    badges?: StringNullableListFilter<"User">
    missionsCompletedCount?: IntFilter<"User"> | number
    recommendedPath?: StringNullableListFilter<"User">
    recommendedTools?: StringNullableListFilter<"User">
    predictedEngagementScore?: FloatNullableFilter<"User"> | number | null
    confidenceScore?: FloatFilter<"User"> | number
    profileDrift?: FloatFilter<"User"> | number
    behavioralVibrancy?: JsonNullableFilter<"User">
    lastHypothesisUpdate?: DateTimeNullableFilter<"User"> | Date | string | null
    mentor?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    mentees?: UserListRelationFilter
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    quizResults?: QuizResultListRelationFilter
    guildMembers?: GuildMemberListRelationFilter
    missionSubmissions?: MissionSubmissionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    level?: SortOrder
    experience?: SortOrder
    class?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pseudo?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    language?: SortOrder
    ageRange?: SortOrderInput | SortOrder
    currentSituation?: SortOrderInput | SortOrder
    technicalLevel?: SortOrderInput | SortOrder
    domains?: SortOrder
    tools?: SortOrder
    githubUrl?: SortOrderInput | SortOrder
    portfolioUrl?: SortOrderInput | SortOrder
    linkedinUrl?: SortOrderInput | SortOrder
    twitterUrl?: SortOrderInput | SortOrder
    mainObjective?: SortOrderInput | SortOrder
    secondaryObjectives?: SortOrder
    dominantMotivation?: SortOrderInput | SortOrder
    longTermObjective?: SortOrderInput | SortOrder
    preferredRhythm?: SortOrderInput | SortOrder
    onboardingSpeed?: SortOrderInput | SortOrder
    answerConsistency?: SortOrderInput | SortOrder
    connectionFrequency?: SortOrderInput | SortOrder
    dashboardActivity?: SortOrderInput | SortOrder
    communityEngagement?: SortOrderInput | SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    cohortsJoined?: SortOrder
    collaborativeProjects?: SortOrder
    mentorId?: SortOrderInput | SortOrder
    projectsRealized?: SortOrder
    activePaths?: SortOrder
    badges?: SortOrder
    missionsCompletedCount?: SortOrder
    recommendedPath?: SortOrder
    recommendedTools?: SortOrder
    predictedEngagementScore?: SortOrderInput | SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
    behavioralVibrancy?: SortOrderInput | SortOrder
    lastHypothesisUpdate?: SortOrderInput | SortOrder
    mentor?: UserOrderByWithRelationInput
    mentees?: UserOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    quizResults?: QuizResultOrderByRelationAggregateInput
    guildMembers?: GuildMemberOrderByRelationAggregateInput
    missionSubmissions?: MissionSubmissionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    pseudo?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    experience?: IntFilter<"User"> | number
    class?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bio?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    language?: StringFilter<"User"> | string
    ageRange?: StringNullableFilter<"User"> | string | null
    currentSituation?: StringNullableFilter<"User"> | string | null
    technicalLevel?: StringNullableFilter<"User"> | string | null
    domains?: StringNullableListFilter<"User">
    tools?: StringNullableListFilter<"User">
    githubUrl?: StringNullableFilter<"User"> | string | null
    portfolioUrl?: StringNullableFilter<"User"> | string | null
    linkedinUrl?: StringNullableFilter<"User"> | string | null
    twitterUrl?: StringNullableFilter<"User"> | string | null
    mainObjective?: StringNullableFilter<"User"> | string | null
    secondaryObjectives?: StringNullableListFilter<"User">
    dominantMotivation?: StringNullableFilter<"User"> | string | null
    longTermObjective?: StringNullableFilter<"User"> | string | null
    preferredRhythm?: StringNullableFilter<"User"> | string | null
    onboardingSpeed?: IntNullableFilter<"User"> | number | null
    answerConsistency?: FloatNullableFilter<"User"> | number | null
    connectionFrequency?: FloatNullableFilter<"User"> | number | null
    dashboardActivity?: FloatNullableFilter<"User"> | number | null
    communityEngagement?: FloatNullableFilter<"User"> | number | null
    builderScore?: IntFilter<"User"> | number
    creatorScore?: IntFilter<"User"> | number
    strategistScore?: IntFilter<"User"> | number
    catalystScore?: IntFilter<"User"> | number
    polarization?: FloatFilter<"User"> | number
    profileStability?: FloatFilter<"User"> | number
    cohortsJoined?: StringNullableListFilter<"User">
    collaborativeProjects?: StringNullableListFilter<"User">
    mentorId?: StringNullableFilter<"User"> | string | null
    projectsRealized?: StringNullableListFilter<"User">
    activePaths?: StringNullableListFilter<"User">
    badges?: StringNullableListFilter<"User">
    missionsCompletedCount?: IntFilter<"User"> | number
    recommendedPath?: StringNullableListFilter<"User">
    recommendedTools?: StringNullableListFilter<"User">
    predictedEngagementScore?: FloatNullableFilter<"User"> | number | null
    confidenceScore?: FloatFilter<"User"> | number
    profileDrift?: FloatFilter<"User"> | number
    behavioralVibrancy?: JsonNullableFilter<"User">
    lastHypothesisUpdate?: DateTimeNullableFilter<"User"> | Date | string | null
    mentor?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    mentees?: UserListRelationFilter
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    quizResults?: QuizResultListRelationFilter
    guildMembers?: GuildMemberListRelationFilter
    missionSubmissions?: MissionSubmissionListRelationFilter
  }, "id" | "email" | "pseudo">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    level?: SortOrder
    experience?: SortOrder
    class?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pseudo?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    language?: SortOrder
    ageRange?: SortOrderInput | SortOrder
    currentSituation?: SortOrderInput | SortOrder
    technicalLevel?: SortOrderInput | SortOrder
    domains?: SortOrder
    tools?: SortOrder
    githubUrl?: SortOrderInput | SortOrder
    portfolioUrl?: SortOrderInput | SortOrder
    linkedinUrl?: SortOrderInput | SortOrder
    twitterUrl?: SortOrderInput | SortOrder
    mainObjective?: SortOrderInput | SortOrder
    secondaryObjectives?: SortOrder
    dominantMotivation?: SortOrderInput | SortOrder
    longTermObjective?: SortOrderInput | SortOrder
    preferredRhythm?: SortOrderInput | SortOrder
    onboardingSpeed?: SortOrderInput | SortOrder
    answerConsistency?: SortOrderInput | SortOrder
    connectionFrequency?: SortOrderInput | SortOrder
    dashboardActivity?: SortOrderInput | SortOrder
    communityEngagement?: SortOrderInput | SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    cohortsJoined?: SortOrder
    collaborativeProjects?: SortOrder
    mentorId?: SortOrderInput | SortOrder
    projectsRealized?: SortOrder
    activePaths?: SortOrder
    badges?: SortOrder
    missionsCompletedCount?: SortOrder
    recommendedPath?: SortOrder
    recommendedTools?: SortOrder
    predictedEngagementScore?: SortOrderInput | SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
    behavioralVibrancy?: SortOrderInput | SortOrder
    lastHypothesisUpdate?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    level?: IntWithAggregatesFilter<"User"> | number
    experience?: IntWithAggregatesFilter<"User"> | number
    class?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    pseudo?: StringNullableWithAggregatesFilter<"User"> | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    city?: StringNullableWithAggregatesFilter<"User"> | string | null
    language?: StringWithAggregatesFilter<"User"> | string
    ageRange?: StringNullableWithAggregatesFilter<"User"> | string | null
    currentSituation?: StringNullableWithAggregatesFilter<"User"> | string | null
    technicalLevel?: StringNullableWithAggregatesFilter<"User"> | string | null
    domains?: StringNullableListFilter<"User">
    tools?: StringNullableListFilter<"User">
    githubUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    portfolioUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    linkedinUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    twitterUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    mainObjective?: StringNullableWithAggregatesFilter<"User"> | string | null
    secondaryObjectives?: StringNullableListFilter<"User">
    dominantMotivation?: StringNullableWithAggregatesFilter<"User"> | string | null
    longTermObjective?: StringNullableWithAggregatesFilter<"User"> | string | null
    preferredRhythm?: StringNullableWithAggregatesFilter<"User"> | string | null
    onboardingSpeed?: IntNullableWithAggregatesFilter<"User"> | number | null
    answerConsistency?: FloatNullableWithAggregatesFilter<"User"> | number | null
    connectionFrequency?: FloatNullableWithAggregatesFilter<"User"> | number | null
    dashboardActivity?: FloatNullableWithAggregatesFilter<"User"> | number | null
    communityEngagement?: FloatNullableWithAggregatesFilter<"User"> | number | null
    builderScore?: IntWithAggregatesFilter<"User"> | number
    creatorScore?: IntWithAggregatesFilter<"User"> | number
    strategistScore?: IntWithAggregatesFilter<"User"> | number
    catalystScore?: IntWithAggregatesFilter<"User"> | number
    polarization?: FloatWithAggregatesFilter<"User"> | number
    profileStability?: FloatWithAggregatesFilter<"User"> | number
    cohortsJoined?: StringNullableListFilter<"User">
    collaborativeProjects?: StringNullableListFilter<"User">
    mentorId?: StringNullableWithAggregatesFilter<"User"> | string | null
    projectsRealized?: StringNullableListFilter<"User">
    activePaths?: StringNullableListFilter<"User">
    badges?: StringNullableListFilter<"User">
    missionsCompletedCount?: IntWithAggregatesFilter<"User"> | number
    recommendedPath?: StringNullableListFilter<"User">
    recommendedTools?: StringNullableListFilter<"User">
    predictedEngagementScore?: FloatNullableWithAggregatesFilter<"User"> | number | null
    confidenceScore?: FloatWithAggregatesFilter<"User"> | number
    profileDrift?: FloatWithAggregatesFilter<"User"> | number
    behavioralVibrancy?: JsonNullableWithAggregatesFilter<"User">
    lastHypothesisUpdate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type MissionWhereInput = {
    AND?: MissionWhereInput | MissionWhereInput[]
    OR?: MissionWhereInput[]
    NOT?: MissionWhereInput | MissionWhereInput[]
    id?: StringFilter<"Mission"> | string
    title?: StringFilter<"Mission"> | string
    description?: StringFilter<"Mission"> | string
    slug?: StringFilter<"Mission"> | string
    category?: StringFilter<"Mission"> | string
    difficulty?: IntFilter<"Mission"> | number
    xp?: IntFilter<"Mission"> | number
    weightBuilder?: FloatFilter<"Mission"> | number
    weightCreator?: FloatFilter<"Mission"> | number
    weightStrategist?: FloatFilter<"Mission"> | number
    weightCatalyst?: FloatFilter<"Mission"> | number
    createdAt?: DateTimeFilter<"Mission"> | Date | string
    updatedAt?: DateTimeFilter<"Mission"> | Date | string
    submissions?: MissionSubmissionListRelationFilter
  }

  export type MissionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    submissions?: MissionSubmissionOrderByRelationAggregateInput
  }

  export type MissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: MissionWhereInput | MissionWhereInput[]
    OR?: MissionWhereInput[]
    NOT?: MissionWhereInput | MissionWhereInput[]
    title?: StringFilter<"Mission"> | string
    description?: StringFilter<"Mission"> | string
    category?: StringFilter<"Mission"> | string
    difficulty?: IntFilter<"Mission"> | number
    xp?: IntFilter<"Mission"> | number
    weightBuilder?: FloatFilter<"Mission"> | number
    weightCreator?: FloatFilter<"Mission"> | number
    weightStrategist?: FloatFilter<"Mission"> | number
    weightCatalyst?: FloatFilter<"Mission"> | number
    createdAt?: DateTimeFilter<"Mission"> | Date | string
    updatedAt?: DateTimeFilter<"Mission"> | Date | string
    submissions?: MissionSubmissionListRelationFilter
  }, "id" | "slug">

  export type MissionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MissionCountOrderByAggregateInput
    _avg?: MissionAvgOrderByAggregateInput
    _max?: MissionMaxOrderByAggregateInput
    _min?: MissionMinOrderByAggregateInput
    _sum?: MissionSumOrderByAggregateInput
  }

  export type MissionScalarWhereWithAggregatesInput = {
    AND?: MissionScalarWhereWithAggregatesInput | MissionScalarWhereWithAggregatesInput[]
    OR?: MissionScalarWhereWithAggregatesInput[]
    NOT?: MissionScalarWhereWithAggregatesInput | MissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Mission"> | string
    title?: StringWithAggregatesFilter<"Mission"> | string
    description?: StringWithAggregatesFilter<"Mission"> | string
    slug?: StringWithAggregatesFilter<"Mission"> | string
    category?: StringWithAggregatesFilter<"Mission"> | string
    difficulty?: IntWithAggregatesFilter<"Mission"> | number
    xp?: IntWithAggregatesFilter<"Mission"> | number
    weightBuilder?: FloatWithAggregatesFilter<"Mission"> | number
    weightCreator?: FloatWithAggregatesFilter<"Mission"> | number
    weightStrategist?: FloatWithAggregatesFilter<"Mission"> | number
    weightCatalyst?: FloatWithAggregatesFilter<"Mission"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Mission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Mission"> | Date | string
  }

  export type GuildWhereInput = {
    AND?: GuildWhereInput | GuildWhereInput[]
    OR?: GuildWhereInput[]
    NOT?: GuildWhereInput | GuildWhereInput[]
    id?: StringFilter<"Guild"> | string
    name?: StringFilter<"Guild"> | string
    description?: StringNullableFilter<"Guild"> | string | null
    slug?: StringFilter<"Guild"> | string
    requiredLevel?: IntFilter<"Guild"> | number
    isPrivate?: BoolFilter<"Guild"> | boolean
    createdAt?: DateTimeFilter<"Guild"> | Date | string
    updatedAt?: DateTimeFilter<"Guild"> | Date | string
    members?: GuildMemberListRelationFilter
  }

  export type GuildOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    slug?: SortOrder
    requiredLevel?: SortOrder
    isPrivate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: GuildMemberOrderByRelationAggregateInput
  }

  export type GuildWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: GuildWhereInput | GuildWhereInput[]
    OR?: GuildWhereInput[]
    NOT?: GuildWhereInput | GuildWhereInput[]
    name?: StringFilter<"Guild"> | string
    description?: StringNullableFilter<"Guild"> | string | null
    requiredLevel?: IntFilter<"Guild"> | number
    isPrivate?: BoolFilter<"Guild"> | boolean
    createdAt?: DateTimeFilter<"Guild"> | Date | string
    updatedAt?: DateTimeFilter<"Guild"> | Date | string
    members?: GuildMemberListRelationFilter
  }, "id" | "slug">

  export type GuildOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    slug?: SortOrder
    requiredLevel?: SortOrder
    isPrivate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GuildCountOrderByAggregateInput
    _avg?: GuildAvgOrderByAggregateInput
    _max?: GuildMaxOrderByAggregateInput
    _min?: GuildMinOrderByAggregateInput
    _sum?: GuildSumOrderByAggregateInput
  }

  export type GuildScalarWhereWithAggregatesInput = {
    AND?: GuildScalarWhereWithAggregatesInput | GuildScalarWhereWithAggregatesInput[]
    OR?: GuildScalarWhereWithAggregatesInput[]
    NOT?: GuildScalarWhereWithAggregatesInput | GuildScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Guild"> | string
    name?: StringWithAggregatesFilter<"Guild"> | string
    description?: StringNullableWithAggregatesFilter<"Guild"> | string | null
    slug?: StringWithAggregatesFilter<"Guild"> | string
    requiredLevel?: IntWithAggregatesFilter<"Guild"> | number
    isPrivate?: BoolWithAggregatesFilter<"Guild"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Guild"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Guild"> | Date | string
  }

  export type GuildMemberWhereInput = {
    AND?: GuildMemberWhereInput | GuildMemberWhereInput[]
    OR?: GuildMemberWhereInput[]
    NOT?: GuildMemberWhereInput | GuildMemberWhereInput[]
    id?: StringFilter<"GuildMember"> | string
    userId?: StringFilter<"GuildMember"> | string
    guildId?: StringFilter<"GuildMember"> | string
    role?: StringFilter<"GuildMember"> | string
    joinedAt?: DateTimeFilter<"GuildMember"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }

  export type GuildMemberOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    guildId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    guild?: GuildOrderByWithRelationInput
  }

  export type GuildMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_guildId?: GuildMemberUserIdGuildIdCompoundUniqueInput
    AND?: GuildMemberWhereInput | GuildMemberWhereInput[]
    OR?: GuildMemberWhereInput[]
    NOT?: GuildMemberWhereInput | GuildMemberWhereInput[]
    userId?: StringFilter<"GuildMember"> | string
    guildId?: StringFilter<"GuildMember"> | string
    role?: StringFilter<"GuildMember"> | string
    joinedAt?: DateTimeFilter<"GuildMember"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    guild?: XOR<GuildScalarRelationFilter, GuildWhereInput>
  }, "id" | "userId_guildId">

  export type GuildMemberOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    guildId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    _count?: GuildMemberCountOrderByAggregateInput
    _max?: GuildMemberMaxOrderByAggregateInput
    _min?: GuildMemberMinOrderByAggregateInput
  }

  export type GuildMemberScalarWhereWithAggregatesInput = {
    AND?: GuildMemberScalarWhereWithAggregatesInput | GuildMemberScalarWhereWithAggregatesInput[]
    OR?: GuildMemberScalarWhereWithAggregatesInput[]
    NOT?: GuildMemberScalarWhereWithAggregatesInput | GuildMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GuildMember"> | string
    userId?: StringWithAggregatesFilter<"GuildMember"> | string
    guildId?: StringWithAggregatesFilter<"GuildMember"> | string
    role?: StringWithAggregatesFilter<"GuildMember"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"GuildMember"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    providerId_accountId?: AccountProviderIdAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "providerId_accountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    identifier_value?: VerificationIdentifierValueCompoundUniqueInput
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
  }, "id" | "identifier_value">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
  }

  export type QuizResultWhereInput = {
    AND?: QuizResultWhereInput | QuizResultWhereInput[]
    OR?: QuizResultWhereInput[]
    NOT?: QuizResultWhereInput | QuizResultWhereInput[]
    id?: StringFilter<"QuizResult"> | string
    userId?: StringNullableFilter<"QuizResult"> | string | null
    profileType?: StringFilter<"QuizResult"> | string
    score?: IntNullableFilter<"QuizResult"> | number | null
    answers?: JsonFilter<"QuizResult">
    averageResponseTime?: IntNullableFilter<"QuizResult"> | number | null
    detailedResponseTimes?: JsonNullableFilter<"QuizResult">
    createdAt?: DateTimeFilter<"QuizResult"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type QuizResultOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    profileType?: SortOrder
    score?: SortOrderInput | SortOrder
    answers?: SortOrder
    averageResponseTime?: SortOrderInput | SortOrder
    detailedResponseTimes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type QuizResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizResultWhereInput | QuizResultWhereInput[]
    OR?: QuizResultWhereInput[]
    NOT?: QuizResultWhereInput | QuizResultWhereInput[]
    userId?: StringNullableFilter<"QuizResult"> | string | null
    profileType?: StringFilter<"QuizResult"> | string
    score?: IntNullableFilter<"QuizResult"> | number | null
    answers?: JsonFilter<"QuizResult">
    averageResponseTime?: IntNullableFilter<"QuizResult"> | number | null
    detailedResponseTimes?: JsonNullableFilter<"QuizResult">
    createdAt?: DateTimeFilter<"QuizResult"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type QuizResultOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    profileType?: SortOrder
    score?: SortOrderInput | SortOrder
    answers?: SortOrder
    averageResponseTime?: SortOrderInput | SortOrder
    detailedResponseTimes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: QuizResultCountOrderByAggregateInput
    _avg?: QuizResultAvgOrderByAggregateInput
    _max?: QuizResultMaxOrderByAggregateInput
    _min?: QuizResultMinOrderByAggregateInput
    _sum?: QuizResultSumOrderByAggregateInput
  }

  export type QuizResultScalarWhereWithAggregatesInput = {
    AND?: QuizResultScalarWhereWithAggregatesInput | QuizResultScalarWhereWithAggregatesInput[]
    OR?: QuizResultScalarWhereWithAggregatesInput[]
    NOT?: QuizResultScalarWhereWithAggregatesInput | QuizResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizResult"> | string
    userId?: StringNullableWithAggregatesFilter<"QuizResult"> | string | null
    profileType?: StringWithAggregatesFilter<"QuizResult"> | string
    score?: IntNullableWithAggregatesFilter<"QuizResult"> | number | null
    answers?: JsonWithAggregatesFilter<"QuizResult">
    averageResponseTime?: IntNullableWithAggregatesFilter<"QuizResult"> | number | null
    detailedResponseTimes?: JsonNullableWithAggregatesFilter<"QuizResult">
    createdAt?: DateTimeWithAggregatesFilter<"QuizResult"> | Date | string
  }

  export type MissionSubmissionWhereInput = {
    AND?: MissionSubmissionWhereInput | MissionSubmissionWhereInput[]
    OR?: MissionSubmissionWhereInput[]
    NOT?: MissionSubmissionWhereInput | MissionSubmissionWhereInput[]
    id?: StringFilter<"MissionSubmission"> | string
    userId?: StringFilter<"MissionSubmission"> | string
    missionId?: StringFilter<"MissionSubmission"> | string
    status?: StringFilter<"MissionSubmission"> | string
    content?: StringNullableFilter<"MissionSubmission"> | string | null
    projectDescription?: StringNullableFilter<"MissionSubmission"> | string | null
    userDifficulty?: IntNullableFilter<"MissionSubmission"> | number | null
    userRating?: IntNullableFilter<"MissionSubmission"> | number | null
    userFeedback?: StringNullableFilter<"MissionSubmission"> | string | null
    improvementSuggestions?: StringNullableFilter<"MissionSubmission"> | string | null
    reviewerFeedback?: StringNullableFilter<"MissionSubmission"> | string | null
    xpAwarded?: IntFilter<"MissionSubmission"> | number
    createdAt?: DateTimeFilter<"MissionSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"MissionSubmission"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    mission?: XOR<MissionScalarRelationFilter, MissionWhereInput>
  }

  export type MissionSubmissionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    missionId?: SortOrder
    status?: SortOrder
    content?: SortOrderInput | SortOrder
    projectDescription?: SortOrderInput | SortOrder
    userDifficulty?: SortOrderInput | SortOrder
    userRating?: SortOrderInput | SortOrder
    userFeedback?: SortOrderInput | SortOrder
    improvementSuggestions?: SortOrderInput | SortOrder
    reviewerFeedback?: SortOrderInput | SortOrder
    xpAwarded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    mission?: MissionOrderByWithRelationInput
  }

  export type MissionSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_missionId?: MissionSubmissionUserIdMissionIdCompoundUniqueInput
    AND?: MissionSubmissionWhereInput | MissionSubmissionWhereInput[]
    OR?: MissionSubmissionWhereInput[]
    NOT?: MissionSubmissionWhereInput | MissionSubmissionWhereInput[]
    userId?: StringFilter<"MissionSubmission"> | string
    missionId?: StringFilter<"MissionSubmission"> | string
    status?: StringFilter<"MissionSubmission"> | string
    content?: StringNullableFilter<"MissionSubmission"> | string | null
    projectDescription?: StringNullableFilter<"MissionSubmission"> | string | null
    userDifficulty?: IntNullableFilter<"MissionSubmission"> | number | null
    userRating?: IntNullableFilter<"MissionSubmission"> | number | null
    userFeedback?: StringNullableFilter<"MissionSubmission"> | string | null
    improvementSuggestions?: StringNullableFilter<"MissionSubmission"> | string | null
    reviewerFeedback?: StringNullableFilter<"MissionSubmission"> | string | null
    xpAwarded?: IntFilter<"MissionSubmission"> | number
    createdAt?: DateTimeFilter<"MissionSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"MissionSubmission"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    mission?: XOR<MissionScalarRelationFilter, MissionWhereInput>
  }, "id" | "userId_missionId">

  export type MissionSubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    missionId?: SortOrder
    status?: SortOrder
    content?: SortOrderInput | SortOrder
    projectDescription?: SortOrderInput | SortOrder
    userDifficulty?: SortOrderInput | SortOrder
    userRating?: SortOrderInput | SortOrder
    userFeedback?: SortOrderInput | SortOrder
    improvementSuggestions?: SortOrderInput | SortOrder
    reviewerFeedback?: SortOrderInput | SortOrder
    xpAwarded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MissionSubmissionCountOrderByAggregateInput
    _avg?: MissionSubmissionAvgOrderByAggregateInput
    _max?: MissionSubmissionMaxOrderByAggregateInput
    _min?: MissionSubmissionMinOrderByAggregateInput
    _sum?: MissionSubmissionSumOrderByAggregateInput
  }

  export type MissionSubmissionScalarWhereWithAggregatesInput = {
    AND?: MissionSubmissionScalarWhereWithAggregatesInput | MissionSubmissionScalarWhereWithAggregatesInput[]
    OR?: MissionSubmissionScalarWhereWithAggregatesInput[]
    NOT?: MissionSubmissionScalarWhereWithAggregatesInput | MissionSubmissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MissionSubmission"> | string
    userId?: StringWithAggregatesFilter<"MissionSubmission"> | string
    missionId?: StringWithAggregatesFilter<"MissionSubmission"> | string
    status?: StringWithAggregatesFilter<"MissionSubmission"> | string
    content?: StringNullableWithAggregatesFilter<"MissionSubmission"> | string | null
    projectDescription?: StringNullableWithAggregatesFilter<"MissionSubmission"> | string | null
    userDifficulty?: IntNullableWithAggregatesFilter<"MissionSubmission"> | number | null
    userRating?: IntNullableWithAggregatesFilter<"MissionSubmission"> | number | null
    userFeedback?: StringNullableWithAggregatesFilter<"MissionSubmission"> | string | null
    improvementSuggestions?: StringNullableWithAggregatesFilter<"MissionSubmission"> | string | null
    reviewerFeedback?: StringNullableWithAggregatesFilter<"MissionSubmission"> | string | null
    xpAwarded?: IntWithAggregatesFilter<"MissionSubmission"> | number
    createdAt?: DateTimeWithAggregatesFilter<"MissionSubmission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MissionSubmission"> | Date | string
  }

  export type ContactMessageWhereInput = {
    AND?: ContactMessageWhereInput | ContactMessageWhereInput[]
    OR?: ContactMessageWhereInput[]
    NOT?: ContactMessageWhereInput | ContactMessageWhereInput[]
    id?: StringFilter<"ContactMessage"> | string
    type?: StringFilter<"ContactMessage"> | string
    email?: StringFilter<"ContactMessage"> | string
    subject?: StringFilter<"ContactMessage"> | string
    content?: StringFilter<"ContactMessage"> | string
    status?: StringFilter<"ContactMessage"> | string
    createdAt?: DateTimeFilter<"ContactMessage"> | Date | string
  }

  export type ContactMessageOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContactMessageWhereInput | ContactMessageWhereInput[]
    OR?: ContactMessageWhereInput[]
    NOT?: ContactMessageWhereInput | ContactMessageWhereInput[]
    type?: StringFilter<"ContactMessage"> | string
    email?: StringFilter<"ContactMessage"> | string
    subject?: StringFilter<"ContactMessage"> | string
    content?: StringFilter<"ContactMessage"> | string
    status?: StringFilter<"ContactMessage"> | string
    createdAt?: DateTimeFilter<"ContactMessage"> | Date | string
  }, "id">

  export type ContactMessageOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ContactMessageCountOrderByAggregateInput
    _max?: ContactMessageMaxOrderByAggregateInput
    _min?: ContactMessageMinOrderByAggregateInput
  }

  export type ContactMessageScalarWhereWithAggregatesInput = {
    AND?: ContactMessageScalarWhereWithAggregatesInput | ContactMessageScalarWhereWithAggregatesInput[]
    OR?: ContactMessageScalarWhereWithAggregatesInput[]
    NOT?: ContactMessageScalarWhereWithAggregatesInput | ContactMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContactMessage"> | string
    type?: StringWithAggregatesFilter<"ContactMessage"> | string
    email?: StringWithAggregatesFilter<"ContactMessage"> | string
    subject?: StringWithAggregatesFilter<"ContactMessage"> | string
    content?: StringWithAggregatesFilter<"ContactMessage"> | string
    status?: StringWithAggregatesFilter<"ContactMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ContactMessage"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    mentees?: UserCreateNestedManyWithoutMentorInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    mentees?: UserUpdateManyWithoutMentorNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MissionCreateInput = {
    id?: string
    title: string
    description: string
    slug: string
    category: string
    difficulty?: number
    xp?: number
    weightBuilder?: number
    weightCreator?: number
    weightStrategist?: number
    weightCatalyst?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: MissionSubmissionCreateNestedManyWithoutMissionInput
  }

  export type MissionUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    slug: string
    category: string
    difficulty?: number
    xp?: number
    weightBuilder?: number
    weightCreator?: number
    weightStrategist?: number
    weightCatalyst?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    submissions?: MissionSubmissionUncheckedCreateNestedManyWithoutMissionInput
  }

  export type MissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    weightBuilder?: FloatFieldUpdateOperationsInput | number
    weightCreator?: FloatFieldUpdateOperationsInput | number
    weightStrategist?: FloatFieldUpdateOperationsInput | number
    weightCatalyst?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: MissionSubmissionUpdateManyWithoutMissionNestedInput
  }

  export type MissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    weightBuilder?: FloatFieldUpdateOperationsInput | number
    weightCreator?: FloatFieldUpdateOperationsInput | number
    weightStrategist?: FloatFieldUpdateOperationsInput | number
    weightCatalyst?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: MissionSubmissionUncheckedUpdateManyWithoutMissionNestedInput
  }

  export type MissionCreateManyInput = {
    id?: string
    title: string
    description: string
    slug: string
    category: string
    difficulty?: number
    xp?: number
    weightBuilder?: number
    weightCreator?: number
    weightStrategist?: number
    weightCatalyst?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    weightBuilder?: FloatFieldUpdateOperationsInput | number
    weightCreator?: FloatFieldUpdateOperationsInput | number
    weightStrategist?: FloatFieldUpdateOperationsInput | number
    weightCatalyst?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    weightBuilder?: FloatFieldUpdateOperationsInput | number
    weightCreator?: FloatFieldUpdateOperationsInput | number
    weightStrategist?: FloatFieldUpdateOperationsInput | number
    weightCatalyst?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildCreateInput = {
    id?: string
    name: string
    description?: string | null
    slug: string
    requiredLevel?: number
    isPrivate?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: GuildMemberCreateNestedManyWithoutGuildInput
  }

  export type GuildUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    slug: string
    requiredLevel?: number
    isPrivate?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: GuildMemberUncheckedCreateNestedManyWithoutGuildInput
  }

  export type GuildUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: StringFieldUpdateOperationsInput | string
    requiredLevel?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: GuildMemberUpdateManyWithoutGuildNestedInput
  }

  export type GuildUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: StringFieldUpdateOperationsInput | string
    requiredLevel?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: GuildMemberUncheckedUpdateManyWithoutGuildNestedInput
  }

  export type GuildCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    slug: string
    requiredLevel?: number
    isPrivate?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GuildUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: StringFieldUpdateOperationsInput | string
    requiredLevel?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: StringFieldUpdateOperationsInput | string
    requiredLevel?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberCreateInput = {
    id?: string
    role?: string
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutGuildMembersInput
    guild: GuildCreateNestedOneWithoutMembersInput
  }

  export type GuildMemberUncheckedCreateInput = {
    id?: string
    userId: string
    guildId: string
    role?: string
    joinedAt?: Date | string
  }

  export type GuildMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGuildMembersNestedInput
    guild?: GuildUpdateOneRequiredWithoutMembersNestedInput
  }

  export type GuildMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberCreateManyInput = {
    id?: string
    userId: string
    guildId: string
    role?: string
    joinedAt?: Date | string
  }

  export type GuildMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUncheckedCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationCreateManyInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QuizResultCreateInput = {
    id?: string
    profileType: string
    score?: number | null
    answers: JsonNullValueInput | InputJsonValue
    averageResponseTime?: number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutQuizResultsInput
  }

  export type QuizResultUncheckedCreateInput = {
    id?: string
    userId?: string | null
    profileType: string
    score?: number | null
    answers: JsonNullValueInput | InputJsonValue
    averageResponseTime?: number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type QuizResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutQuizResultsNestedInput
  }

  export type QuizResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizResultCreateManyInput = {
    id?: string
    userId?: string | null
    profileType: string
    score?: number | null
    answers: JsonNullValueInput | InputJsonValue
    averageResponseTime?: number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type QuizResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionCreateInput = {
    id?: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMissionSubmissionsInput
    mission: MissionCreateNestedOneWithoutSubmissionsInput
  }

  export type MissionSubmissionUncheckedCreateInput = {
    id?: string
    userId: string
    missionId: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMissionSubmissionsNestedInput
    mission?: MissionUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type MissionSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    missionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionCreateManyInput = {
    id?: string
    userId: string
    missionId: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    missionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageCreateInput = {
    id?: string
    type: string
    email: string
    subject: string
    content: string
    status?: string
    createdAt?: Date | string
  }

  export type ContactMessageUncheckedCreateInput = {
    id?: string
    type: string
    email: string
    subject: string
    content: string
    status?: string
    createdAt?: Date | string
  }

  export type ContactMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageCreateManyInput = {
    id?: string
    type: string
    email: string
    subject: string
    content: string
    status?: string
    createdAt?: Date | string
  }

  export type ContactMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContactMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
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
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type QuizResultListRelationFilter = {
    every?: QuizResultWhereInput
    some?: QuizResultWhereInput
    none?: QuizResultWhereInput
  }

  export type GuildMemberListRelationFilter = {
    every?: GuildMemberWhereInput
    some?: GuildMemberWhereInput
    none?: GuildMemberWhereInput
  }

  export type MissionSubmissionListRelationFilter = {
    every?: MissionSubmissionWhereInput
    some?: MissionSubmissionWhereInput
    none?: MissionSubmissionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuizResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuildMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MissionSubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    class?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pseudo?: SortOrder
    bio?: SortOrder
    country?: SortOrder
    city?: SortOrder
    language?: SortOrder
    ageRange?: SortOrder
    currentSituation?: SortOrder
    technicalLevel?: SortOrder
    domains?: SortOrder
    tools?: SortOrder
    githubUrl?: SortOrder
    portfolioUrl?: SortOrder
    linkedinUrl?: SortOrder
    twitterUrl?: SortOrder
    mainObjective?: SortOrder
    secondaryObjectives?: SortOrder
    dominantMotivation?: SortOrder
    longTermObjective?: SortOrder
    preferredRhythm?: SortOrder
    onboardingSpeed?: SortOrder
    answerConsistency?: SortOrder
    connectionFrequency?: SortOrder
    dashboardActivity?: SortOrder
    communityEngagement?: SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    cohortsJoined?: SortOrder
    collaborativeProjects?: SortOrder
    mentorId?: SortOrder
    projectsRealized?: SortOrder
    activePaths?: SortOrder
    badges?: SortOrder
    missionsCompletedCount?: SortOrder
    recommendedPath?: SortOrder
    recommendedTools?: SortOrder
    predictedEngagementScore?: SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
    behavioralVibrancy?: SortOrder
    lastHypothesisUpdate?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    level?: SortOrder
    experience?: SortOrder
    onboardingSpeed?: SortOrder
    answerConsistency?: SortOrder
    connectionFrequency?: SortOrder
    dashboardActivity?: SortOrder
    communityEngagement?: SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    missionsCompletedCount?: SortOrder
    predictedEngagementScore?: SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    class?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pseudo?: SortOrder
    bio?: SortOrder
    country?: SortOrder
    city?: SortOrder
    language?: SortOrder
    ageRange?: SortOrder
    currentSituation?: SortOrder
    technicalLevel?: SortOrder
    githubUrl?: SortOrder
    portfolioUrl?: SortOrder
    linkedinUrl?: SortOrder
    twitterUrl?: SortOrder
    mainObjective?: SortOrder
    dominantMotivation?: SortOrder
    longTermObjective?: SortOrder
    preferredRhythm?: SortOrder
    onboardingSpeed?: SortOrder
    answerConsistency?: SortOrder
    connectionFrequency?: SortOrder
    dashboardActivity?: SortOrder
    communityEngagement?: SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    mentorId?: SortOrder
    missionsCompletedCount?: SortOrder
    predictedEngagementScore?: SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
    lastHypothesisUpdate?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    level?: SortOrder
    experience?: SortOrder
    class?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pseudo?: SortOrder
    bio?: SortOrder
    country?: SortOrder
    city?: SortOrder
    language?: SortOrder
    ageRange?: SortOrder
    currentSituation?: SortOrder
    technicalLevel?: SortOrder
    githubUrl?: SortOrder
    portfolioUrl?: SortOrder
    linkedinUrl?: SortOrder
    twitterUrl?: SortOrder
    mainObjective?: SortOrder
    dominantMotivation?: SortOrder
    longTermObjective?: SortOrder
    preferredRhythm?: SortOrder
    onboardingSpeed?: SortOrder
    answerConsistency?: SortOrder
    connectionFrequency?: SortOrder
    dashboardActivity?: SortOrder
    communityEngagement?: SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    mentorId?: SortOrder
    missionsCompletedCount?: SortOrder
    predictedEngagementScore?: SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
    lastHypothesisUpdate?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    level?: SortOrder
    experience?: SortOrder
    onboardingSpeed?: SortOrder
    answerConsistency?: SortOrder
    connectionFrequency?: SortOrder
    dashboardActivity?: SortOrder
    communityEngagement?: SortOrder
    builderScore?: SortOrder
    creatorScore?: SortOrder
    strategistScore?: SortOrder
    catalystScore?: SortOrder
    polarization?: SortOrder
    profileStability?: SortOrder
    missionsCompletedCount?: SortOrder
    predictedEngagementScore?: SortOrder
    confidenceScore?: SortOrder
    profileDrift?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
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
  }

  export type MissionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MissionAvgOrderByAggregateInput = {
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
  }

  export type MissionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MissionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MissionSumOrderByAggregateInput = {
    difficulty?: SortOrder
    xp?: SortOrder
    weightBuilder?: SortOrder
    weightCreator?: SortOrder
    weightStrategist?: SortOrder
    weightCatalyst?: SortOrder
  }

  export type GuildCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    requiredLevel?: SortOrder
    isPrivate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildAvgOrderByAggregateInput = {
    requiredLevel?: SortOrder
  }

  export type GuildMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    requiredLevel?: SortOrder
    isPrivate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    slug?: SortOrder
    requiredLevel?: SortOrder
    isPrivate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GuildSumOrderByAggregateInput = {
    requiredLevel?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type GuildScalarRelationFilter = {
    is?: GuildWhereInput
    isNot?: GuildWhereInput
  }

  export type GuildMemberUserIdGuildIdCompoundUniqueInput = {
    userId: string
    guildId: string
  }

  export type GuildMemberCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    guildId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type GuildMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    guildId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type GuildMemberMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    guildId?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type AccountProviderIdAccountIdCompoundUniqueInput = {
    providerId: string
    accountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationIdentifierValueCompoundUniqueInput = {
    identifier: string
    value: string
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type QuizResultCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    profileType?: SortOrder
    score?: SortOrder
    answers?: SortOrder
    averageResponseTime?: SortOrder
    detailedResponseTimes?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizResultAvgOrderByAggregateInput = {
    score?: SortOrder
    averageResponseTime?: SortOrder
  }

  export type QuizResultMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    profileType?: SortOrder
    score?: SortOrder
    averageResponseTime?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizResultMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    profileType?: SortOrder
    score?: SortOrder
    averageResponseTime?: SortOrder
    createdAt?: SortOrder
  }

  export type QuizResultSumOrderByAggregateInput = {
    score?: SortOrder
    averageResponseTime?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type MissionScalarRelationFilter = {
    is?: MissionWhereInput
    isNot?: MissionWhereInput
  }

  export type MissionSubmissionUserIdMissionIdCompoundUniqueInput = {
    userId: string
    missionId: string
  }

  export type MissionSubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    missionId?: SortOrder
    status?: SortOrder
    content?: SortOrder
    projectDescription?: SortOrder
    userDifficulty?: SortOrder
    userRating?: SortOrder
    userFeedback?: SortOrder
    improvementSuggestions?: SortOrder
    reviewerFeedback?: SortOrder
    xpAwarded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MissionSubmissionAvgOrderByAggregateInput = {
    userDifficulty?: SortOrder
    userRating?: SortOrder
    xpAwarded?: SortOrder
  }

  export type MissionSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    missionId?: SortOrder
    status?: SortOrder
    content?: SortOrder
    projectDescription?: SortOrder
    userDifficulty?: SortOrder
    userRating?: SortOrder
    userFeedback?: SortOrder
    improvementSuggestions?: SortOrder
    reviewerFeedback?: SortOrder
    xpAwarded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MissionSubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    missionId?: SortOrder
    status?: SortOrder
    content?: SortOrder
    projectDescription?: SortOrder
    userDifficulty?: SortOrder
    userRating?: SortOrder
    userFeedback?: SortOrder
    improvementSuggestions?: SortOrder
    reviewerFeedback?: SortOrder
    xpAwarded?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MissionSubmissionSumOrderByAggregateInput = {
    userDifficulty?: SortOrder
    userRating?: SortOrder
    xpAwarded?: SortOrder
  }

  export type ContactMessageCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ContactMessageMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    email?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserCreatedomainsInput = {
    set: string[]
  }

  export type UserCreatetoolsInput = {
    set: string[]
  }

  export type UserCreatesecondaryObjectivesInput = {
    set: string[]
  }

  export type UserCreatecohortsJoinedInput = {
    set: string[]
  }

  export type UserCreatecollaborativeProjectsInput = {
    set: string[]
  }

  export type UserCreateprojectsRealizedInput = {
    set: string[]
  }

  export type UserCreateactivePathsInput = {
    set: string[]
  }

  export type UserCreatebadgesInput = {
    set: string[]
  }

  export type UserCreaterecommendedPathInput = {
    set: string[]
  }

  export type UserCreaterecommendedToolsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutMenteesInput = {
    create?: XOR<UserCreateWithoutMenteesInput, UserUncheckedCreateWithoutMenteesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMenteesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutMentorInput = {
    create?: XOR<UserCreateWithoutMentorInput, UserUncheckedCreateWithoutMentorInput> | UserCreateWithoutMentorInput[] | UserUncheckedCreateWithoutMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutMentorInput | UserCreateOrConnectWithoutMentorInput[]
    createMany?: UserCreateManyMentorInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type QuizResultCreateNestedManyWithoutUserInput = {
    create?: XOR<QuizResultCreateWithoutUserInput, QuizResultUncheckedCreateWithoutUserInput> | QuizResultCreateWithoutUserInput[] | QuizResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizResultCreateOrConnectWithoutUserInput | QuizResultCreateOrConnectWithoutUserInput[]
    createMany?: QuizResultCreateManyUserInputEnvelope
    connect?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
  }

  export type GuildMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<GuildMemberCreateWithoutUserInput, GuildMemberUncheckedCreateWithoutUserInput> | GuildMemberCreateWithoutUserInput[] | GuildMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutUserInput | GuildMemberCreateOrConnectWithoutUserInput[]
    createMany?: GuildMemberCreateManyUserInputEnvelope
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
  }

  export type MissionSubmissionCreateNestedManyWithoutUserInput = {
    create?: XOR<MissionSubmissionCreateWithoutUserInput, MissionSubmissionUncheckedCreateWithoutUserInput> | MissionSubmissionCreateWithoutUserInput[] | MissionSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutUserInput | MissionSubmissionCreateOrConnectWithoutUserInput[]
    createMany?: MissionSubmissionCreateManyUserInputEnvelope
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutMentorInput = {
    create?: XOR<UserCreateWithoutMentorInput, UserUncheckedCreateWithoutMentorInput> | UserCreateWithoutMentorInput[] | UserUncheckedCreateWithoutMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutMentorInput | UserCreateOrConnectWithoutMentorInput[]
    createMany?: UserCreateManyMentorInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type QuizResultUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<QuizResultCreateWithoutUserInput, QuizResultUncheckedCreateWithoutUserInput> | QuizResultCreateWithoutUserInput[] | QuizResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizResultCreateOrConnectWithoutUserInput | QuizResultCreateOrConnectWithoutUserInput[]
    createMany?: QuizResultCreateManyUserInputEnvelope
    connect?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
  }

  export type GuildMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GuildMemberCreateWithoutUserInput, GuildMemberUncheckedCreateWithoutUserInput> | GuildMemberCreateWithoutUserInput[] | GuildMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutUserInput | GuildMemberCreateOrConnectWithoutUserInput[]
    createMany?: GuildMemberCreateManyUserInputEnvelope
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
  }

  export type MissionSubmissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MissionSubmissionCreateWithoutUserInput, MissionSubmissionUncheckedCreateWithoutUserInput> | MissionSubmissionCreateWithoutUserInput[] | MissionSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutUserInput | MissionSubmissionCreateOrConnectWithoutUserInput[]
    createMany?: MissionSubmissionCreateManyUserInputEnvelope
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdatedomainsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdatetoolsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdatesecondaryObjectivesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdatecohortsJoinedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdatecollaborativeProjectsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateprojectsRealizedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateactivePathsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdatebadgesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdaterecommendedPathInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdaterecommendedToolsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneWithoutMenteesNestedInput = {
    create?: XOR<UserCreateWithoutMenteesInput, UserUncheckedCreateWithoutMenteesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMenteesInput
    upsert?: UserUpsertWithoutMenteesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMenteesInput, UserUpdateWithoutMenteesInput>, UserUncheckedUpdateWithoutMenteesInput>
  }

  export type UserUpdateManyWithoutMentorNestedInput = {
    create?: XOR<UserCreateWithoutMentorInput, UserUncheckedCreateWithoutMentorInput> | UserCreateWithoutMentorInput[] | UserUncheckedCreateWithoutMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutMentorInput | UserCreateOrConnectWithoutMentorInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutMentorInput | UserUpsertWithWhereUniqueWithoutMentorInput[]
    createMany?: UserCreateManyMentorInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutMentorInput | UserUpdateWithWhereUniqueWithoutMentorInput[]
    updateMany?: UserUpdateManyWithWhereWithoutMentorInput | UserUpdateManyWithWhereWithoutMentorInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type QuizResultUpdateManyWithoutUserNestedInput = {
    create?: XOR<QuizResultCreateWithoutUserInput, QuizResultUncheckedCreateWithoutUserInput> | QuizResultCreateWithoutUserInput[] | QuizResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizResultCreateOrConnectWithoutUserInput | QuizResultCreateOrConnectWithoutUserInput[]
    upsert?: QuizResultUpsertWithWhereUniqueWithoutUserInput | QuizResultUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QuizResultCreateManyUserInputEnvelope
    set?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    disconnect?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    delete?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    connect?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    update?: QuizResultUpdateWithWhereUniqueWithoutUserInput | QuizResultUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QuizResultUpdateManyWithWhereWithoutUserInput | QuizResultUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QuizResultScalarWhereInput | QuizResultScalarWhereInput[]
  }

  export type GuildMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<GuildMemberCreateWithoutUserInput, GuildMemberUncheckedCreateWithoutUserInput> | GuildMemberCreateWithoutUserInput[] | GuildMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutUserInput | GuildMemberCreateOrConnectWithoutUserInput[]
    upsert?: GuildMemberUpsertWithWhereUniqueWithoutUserInput | GuildMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GuildMemberCreateManyUserInputEnvelope
    set?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    disconnect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    delete?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    update?: GuildMemberUpdateWithWhereUniqueWithoutUserInput | GuildMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GuildMemberUpdateManyWithWhereWithoutUserInput | GuildMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GuildMemberScalarWhereInput | GuildMemberScalarWhereInput[]
  }

  export type MissionSubmissionUpdateManyWithoutUserNestedInput = {
    create?: XOR<MissionSubmissionCreateWithoutUserInput, MissionSubmissionUncheckedCreateWithoutUserInput> | MissionSubmissionCreateWithoutUserInput[] | MissionSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutUserInput | MissionSubmissionCreateOrConnectWithoutUserInput[]
    upsert?: MissionSubmissionUpsertWithWhereUniqueWithoutUserInput | MissionSubmissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MissionSubmissionCreateManyUserInputEnvelope
    set?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    disconnect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    delete?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    update?: MissionSubmissionUpdateWithWhereUniqueWithoutUserInput | MissionSubmissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MissionSubmissionUpdateManyWithWhereWithoutUserInput | MissionSubmissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MissionSubmissionScalarWhereInput | MissionSubmissionScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutMentorNestedInput = {
    create?: XOR<UserCreateWithoutMentorInput, UserUncheckedCreateWithoutMentorInput> | UserCreateWithoutMentorInput[] | UserUncheckedCreateWithoutMentorInput[]
    connectOrCreate?: UserCreateOrConnectWithoutMentorInput | UserCreateOrConnectWithoutMentorInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutMentorInput | UserUpsertWithWhereUniqueWithoutMentorInput[]
    createMany?: UserCreateManyMentorInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutMentorInput | UserUpdateWithWhereUniqueWithoutMentorInput[]
    updateMany?: UserUpdateManyWithWhereWithoutMentorInput | UserUpdateManyWithWhereWithoutMentorInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type QuizResultUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<QuizResultCreateWithoutUserInput, QuizResultUncheckedCreateWithoutUserInput> | QuizResultCreateWithoutUserInput[] | QuizResultUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuizResultCreateOrConnectWithoutUserInput | QuizResultCreateOrConnectWithoutUserInput[]
    upsert?: QuizResultUpsertWithWhereUniqueWithoutUserInput | QuizResultUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QuizResultCreateManyUserInputEnvelope
    set?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    disconnect?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    delete?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    connect?: QuizResultWhereUniqueInput | QuizResultWhereUniqueInput[]
    update?: QuizResultUpdateWithWhereUniqueWithoutUserInput | QuizResultUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QuizResultUpdateManyWithWhereWithoutUserInput | QuizResultUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QuizResultScalarWhereInput | QuizResultScalarWhereInput[]
  }

  export type GuildMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GuildMemberCreateWithoutUserInput, GuildMemberUncheckedCreateWithoutUserInput> | GuildMemberCreateWithoutUserInput[] | GuildMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutUserInput | GuildMemberCreateOrConnectWithoutUserInput[]
    upsert?: GuildMemberUpsertWithWhereUniqueWithoutUserInput | GuildMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GuildMemberCreateManyUserInputEnvelope
    set?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    disconnect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    delete?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    update?: GuildMemberUpdateWithWhereUniqueWithoutUserInput | GuildMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GuildMemberUpdateManyWithWhereWithoutUserInput | GuildMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GuildMemberScalarWhereInput | GuildMemberScalarWhereInput[]
  }

  export type MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MissionSubmissionCreateWithoutUserInput, MissionSubmissionUncheckedCreateWithoutUserInput> | MissionSubmissionCreateWithoutUserInput[] | MissionSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutUserInput | MissionSubmissionCreateOrConnectWithoutUserInput[]
    upsert?: MissionSubmissionUpsertWithWhereUniqueWithoutUserInput | MissionSubmissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MissionSubmissionCreateManyUserInputEnvelope
    set?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    disconnect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    delete?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    update?: MissionSubmissionUpdateWithWhereUniqueWithoutUserInput | MissionSubmissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MissionSubmissionUpdateManyWithWhereWithoutUserInput | MissionSubmissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MissionSubmissionScalarWhereInput | MissionSubmissionScalarWhereInput[]
  }

  export type MissionSubmissionCreateNestedManyWithoutMissionInput = {
    create?: XOR<MissionSubmissionCreateWithoutMissionInput, MissionSubmissionUncheckedCreateWithoutMissionInput> | MissionSubmissionCreateWithoutMissionInput[] | MissionSubmissionUncheckedCreateWithoutMissionInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutMissionInput | MissionSubmissionCreateOrConnectWithoutMissionInput[]
    createMany?: MissionSubmissionCreateManyMissionInputEnvelope
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
  }

  export type MissionSubmissionUncheckedCreateNestedManyWithoutMissionInput = {
    create?: XOR<MissionSubmissionCreateWithoutMissionInput, MissionSubmissionUncheckedCreateWithoutMissionInput> | MissionSubmissionCreateWithoutMissionInput[] | MissionSubmissionUncheckedCreateWithoutMissionInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutMissionInput | MissionSubmissionCreateOrConnectWithoutMissionInput[]
    createMany?: MissionSubmissionCreateManyMissionInputEnvelope
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
  }

  export type MissionSubmissionUpdateManyWithoutMissionNestedInput = {
    create?: XOR<MissionSubmissionCreateWithoutMissionInput, MissionSubmissionUncheckedCreateWithoutMissionInput> | MissionSubmissionCreateWithoutMissionInput[] | MissionSubmissionUncheckedCreateWithoutMissionInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutMissionInput | MissionSubmissionCreateOrConnectWithoutMissionInput[]
    upsert?: MissionSubmissionUpsertWithWhereUniqueWithoutMissionInput | MissionSubmissionUpsertWithWhereUniqueWithoutMissionInput[]
    createMany?: MissionSubmissionCreateManyMissionInputEnvelope
    set?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    disconnect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    delete?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    update?: MissionSubmissionUpdateWithWhereUniqueWithoutMissionInput | MissionSubmissionUpdateWithWhereUniqueWithoutMissionInput[]
    updateMany?: MissionSubmissionUpdateManyWithWhereWithoutMissionInput | MissionSubmissionUpdateManyWithWhereWithoutMissionInput[]
    deleteMany?: MissionSubmissionScalarWhereInput | MissionSubmissionScalarWhereInput[]
  }

  export type MissionSubmissionUncheckedUpdateManyWithoutMissionNestedInput = {
    create?: XOR<MissionSubmissionCreateWithoutMissionInput, MissionSubmissionUncheckedCreateWithoutMissionInput> | MissionSubmissionCreateWithoutMissionInput[] | MissionSubmissionUncheckedCreateWithoutMissionInput[]
    connectOrCreate?: MissionSubmissionCreateOrConnectWithoutMissionInput | MissionSubmissionCreateOrConnectWithoutMissionInput[]
    upsert?: MissionSubmissionUpsertWithWhereUniqueWithoutMissionInput | MissionSubmissionUpsertWithWhereUniqueWithoutMissionInput[]
    createMany?: MissionSubmissionCreateManyMissionInputEnvelope
    set?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    disconnect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    delete?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    connect?: MissionSubmissionWhereUniqueInput | MissionSubmissionWhereUniqueInput[]
    update?: MissionSubmissionUpdateWithWhereUniqueWithoutMissionInput | MissionSubmissionUpdateWithWhereUniqueWithoutMissionInput[]
    updateMany?: MissionSubmissionUpdateManyWithWhereWithoutMissionInput | MissionSubmissionUpdateManyWithWhereWithoutMissionInput[]
    deleteMany?: MissionSubmissionScalarWhereInput | MissionSubmissionScalarWhereInput[]
  }

  export type GuildMemberCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildMemberCreateWithoutGuildInput, GuildMemberUncheckedCreateWithoutGuildInput> | GuildMemberCreateWithoutGuildInput[] | GuildMemberUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutGuildInput | GuildMemberCreateOrConnectWithoutGuildInput[]
    createMany?: GuildMemberCreateManyGuildInputEnvelope
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
  }

  export type GuildMemberUncheckedCreateNestedManyWithoutGuildInput = {
    create?: XOR<GuildMemberCreateWithoutGuildInput, GuildMemberUncheckedCreateWithoutGuildInput> | GuildMemberCreateWithoutGuildInput[] | GuildMemberUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutGuildInput | GuildMemberCreateOrConnectWithoutGuildInput[]
    createMany?: GuildMemberCreateManyGuildInputEnvelope
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
  }

  export type GuildMemberUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildMemberCreateWithoutGuildInput, GuildMemberUncheckedCreateWithoutGuildInput> | GuildMemberCreateWithoutGuildInput[] | GuildMemberUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutGuildInput | GuildMemberCreateOrConnectWithoutGuildInput[]
    upsert?: GuildMemberUpsertWithWhereUniqueWithoutGuildInput | GuildMemberUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildMemberCreateManyGuildInputEnvelope
    set?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    disconnect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    delete?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    update?: GuildMemberUpdateWithWhereUniqueWithoutGuildInput | GuildMemberUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildMemberUpdateManyWithWhereWithoutGuildInput | GuildMemberUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildMemberScalarWhereInput | GuildMemberScalarWhereInput[]
  }

  export type GuildMemberUncheckedUpdateManyWithoutGuildNestedInput = {
    create?: XOR<GuildMemberCreateWithoutGuildInput, GuildMemberUncheckedCreateWithoutGuildInput> | GuildMemberCreateWithoutGuildInput[] | GuildMemberUncheckedCreateWithoutGuildInput[]
    connectOrCreate?: GuildMemberCreateOrConnectWithoutGuildInput | GuildMemberCreateOrConnectWithoutGuildInput[]
    upsert?: GuildMemberUpsertWithWhereUniqueWithoutGuildInput | GuildMemberUpsertWithWhereUniqueWithoutGuildInput[]
    createMany?: GuildMemberCreateManyGuildInputEnvelope
    set?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    disconnect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    delete?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    connect?: GuildMemberWhereUniqueInput | GuildMemberWhereUniqueInput[]
    update?: GuildMemberUpdateWithWhereUniqueWithoutGuildInput | GuildMemberUpdateWithWhereUniqueWithoutGuildInput[]
    updateMany?: GuildMemberUpdateManyWithWhereWithoutGuildInput | GuildMemberUpdateManyWithWhereWithoutGuildInput[]
    deleteMany?: GuildMemberScalarWhereInput | GuildMemberScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutGuildMembersInput = {
    create?: XOR<UserCreateWithoutGuildMembersInput, UserUncheckedCreateWithoutGuildMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutGuildMembersInput
    connect?: UserWhereUniqueInput
  }

  export type GuildCreateNestedOneWithoutMembersInput = {
    create?: XOR<GuildCreateWithoutMembersInput, GuildUncheckedCreateWithoutMembersInput>
    connectOrCreate?: GuildCreateOrConnectWithoutMembersInput
    connect?: GuildWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutGuildMembersNestedInput = {
    create?: XOR<UserCreateWithoutGuildMembersInput, UserUncheckedCreateWithoutGuildMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutGuildMembersInput
    upsert?: UserUpsertWithoutGuildMembersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGuildMembersInput, UserUpdateWithoutGuildMembersInput>, UserUncheckedUpdateWithoutGuildMembersInput>
  }

  export type GuildUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<GuildCreateWithoutMembersInput, GuildUncheckedCreateWithoutMembersInput>
    connectOrCreate?: GuildCreateOrConnectWithoutMembersInput
    upsert?: GuildUpsertWithoutMembersInput
    connect?: GuildWhereUniqueInput
    update?: XOR<XOR<GuildUpdateToOneWithWhereWithoutMembersInput, GuildUpdateWithoutMembersInput>, GuildUncheckedUpdateWithoutMembersInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutQuizResultsInput = {
    create?: XOR<UserCreateWithoutQuizResultsInput, UserUncheckedCreateWithoutQuizResultsInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuizResultsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutQuizResultsNestedInput = {
    create?: XOR<UserCreateWithoutQuizResultsInput, UserUncheckedCreateWithoutQuizResultsInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuizResultsInput
    upsert?: UserUpsertWithoutQuizResultsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutQuizResultsInput, UserUpdateWithoutQuizResultsInput>, UserUncheckedUpdateWithoutQuizResultsInput>
  }

  export type UserCreateNestedOneWithoutMissionSubmissionsInput = {
    create?: XOR<UserCreateWithoutMissionSubmissionsInput, UserUncheckedCreateWithoutMissionSubmissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMissionSubmissionsInput
    connect?: UserWhereUniqueInput
  }

  export type MissionCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<MissionCreateWithoutSubmissionsInput, MissionUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: MissionCreateOrConnectWithoutSubmissionsInput
    connect?: MissionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMissionSubmissionsNestedInput = {
    create?: XOR<UserCreateWithoutMissionSubmissionsInput, UserUncheckedCreateWithoutMissionSubmissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMissionSubmissionsInput
    upsert?: UserUpsertWithoutMissionSubmissionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMissionSubmissionsInput, UserUpdateWithoutMissionSubmissionsInput>, UserUncheckedUpdateWithoutMissionSubmissionsInput>
  }

  export type MissionUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<MissionCreateWithoutSubmissionsInput, MissionUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: MissionCreateOrConnectWithoutSubmissionsInput
    upsert?: MissionUpsertWithoutSubmissionsInput
    connect?: MissionWhereUniqueInput
    update?: XOR<XOR<MissionUpdateToOneWithWhereWithoutSubmissionsInput, MissionUpdateWithoutSubmissionsInput>, MissionUncheckedUpdateWithoutSubmissionsInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
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

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserCreateWithoutMenteesInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMenteesInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMenteesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMenteesInput, UserUncheckedCreateWithoutMenteesInput>
  }

  export type UserCreateWithoutMentorInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserCreateNestedManyWithoutMentorInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMentorInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMentorInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMentorInput, UserUncheckedCreateWithoutMentorInput>
  }

  export type UserCreateManyMentorInputEnvelope = {
    data: UserCreateManyMentorInput | UserCreateManyMentorInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type QuizResultCreateWithoutUserInput = {
    id?: string
    profileType: string
    score?: number | null
    answers: JsonNullValueInput | InputJsonValue
    averageResponseTime?: number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type QuizResultUncheckedCreateWithoutUserInput = {
    id?: string
    profileType: string
    score?: number | null
    answers: JsonNullValueInput | InputJsonValue
    averageResponseTime?: number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type QuizResultCreateOrConnectWithoutUserInput = {
    where: QuizResultWhereUniqueInput
    create: XOR<QuizResultCreateWithoutUserInput, QuizResultUncheckedCreateWithoutUserInput>
  }

  export type QuizResultCreateManyUserInputEnvelope = {
    data: QuizResultCreateManyUserInput | QuizResultCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GuildMemberCreateWithoutUserInput = {
    id?: string
    role?: string
    joinedAt?: Date | string
    guild: GuildCreateNestedOneWithoutMembersInput
  }

  export type GuildMemberUncheckedCreateWithoutUserInput = {
    id?: string
    guildId: string
    role?: string
    joinedAt?: Date | string
  }

  export type GuildMemberCreateOrConnectWithoutUserInput = {
    where: GuildMemberWhereUniqueInput
    create: XOR<GuildMemberCreateWithoutUserInput, GuildMemberUncheckedCreateWithoutUserInput>
  }

  export type GuildMemberCreateManyUserInputEnvelope = {
    data: GuildMemberCreateManyUserInput | GuildMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MissionSubmissionCreateWithoutUserInput = {
    id?: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    mission: MissionCreateNestedOneWithoutSubmissionsInput
  }

  export type MissionSubmissionUncheckedCreateWithoutUserInput = {
    id?: string
    missionId: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionSubmissionCreateOrConnectWithoutUserInput = {
    where: MissionSubmissionWhereUniqueInput
    create: XOR<MissionSubmissionCreateWithoutUserInput, MissionSubmissionUncheckedCreateWithoutUserInput>
  }

  export type MissionSubmissionCreateManyUserInputEnvelope = {
    data: MissionSubmissionCreateManyUserInput | MissionSubmissionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutMenteesInput = {
    update: XOR<UserUpdateWithoutMenteesInput, UserUncheckedUpdateWithoutMenteesInput>
    create: XOR<UserCreateWithoutMenteesInput, UserUncheckedCreateWithoutMenteesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMenteesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMenteesInput, UserUncheckedUpdateWithoutMenteesInput>
  }

  export type UserUpdateWithoutMenteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMenteesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutMentorInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutMentorInput, UserUncheckedUpdateWithoutMentorInput>
    create: XOR<UserCreateWithoutMentorInput, UserUncheckedCreateWithoutMentorInput>
  }

  export type UserUpdateWithWhereUniqueWithoutMentorInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutMentorInput, UserUncheckedUpdateWithoutMentorInput>
  }

  export type UserUpdateManyWithWhereWithoutMentorInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutMentorInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    experience?: IntFilter<"User"> | number
    class?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    pseudo?: StringNullableFilter<"User"> | string | null
    bio?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    language?: StringFilter<"User"> | string
    ageRange?: StringNullableFilter<"User"> | string | null
    currentSituation?: StringNullableFilter<"User"> | string | null
    technicalLevel?: StringNullableFilter<"User"> | string | null
    domains?: StringNullableListFilter<"User">
    tools?: StringNullableListFilter<"User">
    githubUrl?: StringNullableFilter<"User"> | string | null
    portfolioUrl?: StringNullableFilter<"User"> | string | null
    linkedinUrl?: StringNullableFilter<"User"> | string | null
    twitterUrl?: StringNullableFilter<"User"> | string | null
    mainObjective?: StringNullableFilter<"User"> | string | null
    secondaryObjectives?: StringNullableListFilter<"User">
    dominantMotivation?: StringNullableFilter<"User"> | string | null
    longTermObjective?: StringNullableFilter<"User"> | string | null
    preferredRhythm?: StringNullableFilter<"User"> | string | null
    onboardingSpeed?: IntNullableFilter<"User"> | number | null
    answerConsistency?: FloatNullableFilter<"User"> | number | null
    connectionFrequency?: FloatNullableFilter<"User"> | number | null
    dashboardActivity?: FloatNullableFilter<"User"> | number | null
    communityEngagement?: FloatNullableFilter<"User"> | number | null
    builderScore?: IntFilter<"User"> | number
    creatorScore?: IntFilter<"User"> | number
    strategistScore?: IntFilter<"User"> | number
    catalystScore?: IntFilter<"User"> | number
    polarization?: FloatFilter<"User"> | number
    profileStability?: FloatFilter<"User"> | number
    cohortsJoined?: StringNullableListFilter<"User">
    collaborativeProjects?: StringNullableListFilter<"User">
    mentorId?: StringNullableFilter<"User"> | string | null
    projectsRealized?: StringNullableListFilter<"User">
    activePaths?: StringNullableListFilter<"User">
    badges?: StringNullableListFilter<"User">
    missionsCompletedCount?: IntFilter<"User"> | number
    recommendedPath?: StringNullableListFilter<"User">
    recommendedTools?: StringNullableListFilter<"User">
    predictedEngagementScore?: FloatNullableFilter<"User"> | number | null
    confidenceScore?: FloatFilter<"User"> | number
    profileDrift?: FloatFilter<"User"> | number
    behavioralVibrancy?: JsonNullableFilter<"User">
    lastHypothesisUpdate?: DateTimeNullableFilter<"User"> | Date | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type QuizResultUpsertWithWhereUniqueWithoutUserInput = {
    where: QuizResultWhereUniqueInput
    update: XOR<QuizResultUpdateWithoutUserInput, QuizResultUncheckedUpdateWithoutUserInput>
    create: XOR<QuizResultCreateWithoutUserInput, QuizResultUncheckedCreateWithoutUserInput>
  }

  export type QuizResultUpdateWithWhereUniqueWithoutUserInput = {
    where: QuizResultWhereUniqueInput
    data: XOR<QuizResultUpdateWithoutUserInput, QuizResultUncheckedUpdateWithoutUserInput>
  }

  export type QuizResultUpdateManyWithWhereWithoutUserInput = {
    where: QuizResultScalarWhereInput
    data: XOR<QuizResultUpdateManyMutationInput, QuizResultUncheckedUpdateManyWithoutUserInput>
  }

  export type QuizResultScalarWhereInput = {
    AND?: QuizResultScalarWhereInput | QuizResultScalarWhereInput[]
    OR?: QuizResultScalarWhereInput[]
    NOT?: QuizResultScalarWhereInput | QuizResultScalarWhereInput[]
    id?: StringFilter<"QuizResult"> | string
    userId?: StringNullableFilter<"QuizResult"> | string | null
    profileType?: StringFilter<"QuizResult"> | string
    score?: IntNullableFilter<"QuizResult"> | number | null
    answers?: JsonFilter<"QuizResult">
    averageResponseTime?: IntNullableFilter<"QuizResult"> | number | null
    detailedResponseTimes?: JsonNullableFilter<"QuizResult">
    createdAt?: DateTimeFilter<"QuizResult"> | Date | string
  }

  export type GuildMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: GuildMemberWhereUniqueInput
    update: XOR<GuildMemberUpdateWithoutUserInput, GuildMemberUncheckedUpdateWithoutUserInput>
    create: XOR<GuildMemberCreateWithoutUserInput, GuildMemberUncheckedCreateWithoutUserInput>
  }

  export type GuildMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: GuildMemberWhereUniqueInput
    data: XOR<GuildMemberUpdateWithoutUserInput, GuildMemberUncheckedUpdateWithoutUserInput>
  }

  export type GuildMemberUpdateManyWithWhereWithoutUserInput = {
    where: GuildMemberScalarWhereInput
    data: XOR<GuildMemberUpdateManyMutationInput, GuildMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type GuildMemberScalarWhereInput = {
    AND?: GuildMemberScalarWhereInput | GuildMemberScalarWhereInput[]
    OR?: GuildMemberScalarWhereInput[]
    NOT?: GuildMemberScalarWhereInput | GuildMemberScalarWhereInput[]
    id?: StringFilter<"GuildMember"> | string
    userId?: StringFilter<"GuildMember"> | string
    guildId?: StringFilter<"GuildMember"> | string
    role?: StringFilter<"GuildMember"> | string
    joinedAt?: DateTimeFilter<"GuildMember"> | Date | string
  }

  export type MissionSubmissionUpsertWithWhereUniqueWithoutUserInput = {
    where: MissionSubmissionWhereUniqueInput
    update: XOR<MissionSubmissionUpdateWithoutUserInput, MissionSubmissionUncheckedUpdateWithoutUserInput>
    create: XOR<MissionSubmissionCreateWithoutUserInput, MissionSubmissionUncheckedCreateWithoutUserInput>
  }

  export type MissionSubmissionUpdateWithWhereUniqueWithoutUserInput = {
    where: MissionSubmissionWhereUniqueInput
    data: XOR<MissionSubmissionUpdateWithoutUserInput, MissionSubmissionUncheckedUpdateWithoutUserInput>
  }

  export type MissionSubmissionUpdateManyWithWhereWithoutUserInput = {
    where: MissionSubmissionScalarWhereInput
    data: XOR<MissionSubmissionUpdateManyMutationInput, MissionSubmissionUncheckedUpdateManyWithoutUserInput>
  }

  export type MissionSubmissionScalarWhereInput = {
    AND?: MissionSubmissionScalarWhereInput | MissionSubmissionScalarWhereInput[]
    OR?: MissionSubmissionScalarWhereInput[]
    NOT?: MissionSubmissionScalarWhereInput | MissionSubmissionScalarWhereInput[]
    id?: StringFilter<"MissionSubmission"> | string
    userId?: StringFilter<"MissionSubmission"> | string
    missionId?: StringFilter<"MissionSubmission"> | string
    status?: StringFilter<"MissionSubmission"> | string
    content?: StringNullableFilter<"MissionSubmission"> | string | null
    projectDescription?: StringNullableFilter<"MissionSubmission"> | string | null
    userDifficulty?: IntNullableFilter<"MissionSubmission"> | number | null
    userRating?: IntNullableFilter<"MissionSubmission"> | number | null
    userFeedback?: StringNullableFilter<"MissionSubmission"> | string | null
    improvementSuggestions?: StringNullableFilter<"MissionSubmission"> | string | null
    reviewerFeedback?: StringNullableFilter<"MissionSubmission"> | string | null
    xpAwarded?: IntFilter<"MissionSubmission"> | number
    createdAt?: DateTimeFilter<"MissionSubmission"> | Date | string
    updatedAt?: DateTimeFilter<"MissionSubmission"> | Date | string
  }

  export type MissionSubmissionCreateWithoutMissionInput = {
    id?: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMissionSubmissionsInput
  }

  export type MissionSubmissionUncheckedCreateWithoutMissionInput = {
    id?: string
    userId: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionSubmissionCreateOrConnectWithoutMissionInput = {
    where: MissionSubmissionWhereUniqueInput
    create: XOR<MissionSubmissionCreateWithoutMissionInput, MissionSubmissionUncheckedCreateWithoutMissionInput>
  }

  export type MissionSubmissionCreateManyMissionInputEnvelope = {
    data: MissionSubmissionCreateManyMissionInput | MissionSubmissionCreateManyMissionInput[]
    skipDuplicates?: boolean
  }

  export type MissionSubmissionUpsertWithWhereUniqueWithoutMissionInput = {
    where: MissionSubmissionWhereUniqueInput
    update: XOR<MissionSubmissionUpdateWithoutMissionInput, MissionSubmissionUncheckedUpdateWithoutMissionInput>
    create: XOR<MissionSubmissionCreateWithoutMissionInput, MissionSubmissionUncheckedCreateWithoutMissionInput>
  }

  export type MissionSubmissionUpdateWithWhereUniqueWithoutMissionInput = {
    where: MissionSubmissionWhereUniqueInput
    data: XOR<MissionSubmissionUpdateWithoutMissionInput, MissionSubmissionUncheckedUpdateWithoutMissionInput>
  }

  export type MissionSubmissionUpdateManyWithWhereWithoutMissionInput = {
    where: MissionSubmissionScalarWhereInput
    data: XOR<MissionSubmissionUpdateManyMutationInput, MissionSubmissionUncheckedUpdateManyWithoutMissionInput>
  }

  export type GuildMemberCreateWithoutGuildInput = {
    id?: string
    role?: string
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutGuildMembersInput
  }

  export type GuildMemberUncheckedCreateWithoutGuildInput = {
    id?: string
    userId: string
    role?: string
    joinedAt?: Date | string
  }

  export type GuildMemberCreateOrConnectWithoutGuildInput = {
    where: GuildMemberWhereUniqueInput
    create: XOR<GuildMemberCreateWithoutGuildInput, GuildMemberUncheckedCreateWithoutGuildInput>
  }

  export type GuildMemberCreateManyGuildInputEnvelope = {
    data: GuildMemberCreateManyGuildInput | GuildMemberCreateManyGuildInput[]
    skipDuplicates?: boolean
  }

  export type GuildMemberUpsertWithWhereUniqueWithoutGuildInput = {
    where: GuildMemberWhereUniqueInput
    update: XOR<GuildMemberUpdateWithoutGuildInput, GuildMemberUncheckedUpdateWithoutGuildInput>
    create: XOR<GuildMemberCreateWithoutGuildInput, GuildMemberUncheckedCreateWithoutGuildInput>
  }

  export type GuildMemberUpdateWithWhereUniqueWithoutGuildInput = {
    where: GuildMemberWhereUniqueInput
    data: XOR<GuildMemberUpdateWithoutGuildInput, GuildMemberUncheckedUpdateWithoutGuildInput>
  }

  export type GuildMemberUpdateManyWithWhereWithoutGuildInput = {
    where: GuildMemberScalarWhereInput
    data: XOR<GuildMemberUpdateManyMutationInput, GuildMemberUncheckedUpdateManyWithoutGuildInput>
  }

  export type UserCreateWithoutGuildMembersInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    mentees?: UserCreateNestedManyWithoutMentorInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGuildMembersInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGuildMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGuildMembersInput, UserUncheckedCreateWithoutGuildMembersInput>
  }

  export type GuildCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    slug: string
    requiredLevel?: number
    isPrivate?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GuildUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    slug: string
    requiredLevel?: number
    isPrivate?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GuildCreateOrConnectWithoutMembersInput = {
    where: GuildWhereUniqueInput
    create: XOR<GuildCreateWithoutMembersInput, GuildUncheckedCreateWithoutMembersInput>
  }

  export type UserUpsertWithoutGuildMembersInput = {
    update: XOR<UserUpdateWithoutGuildMembersInput, UserUncheckedUpdateWithoutGuildMembersInput>
    create: XOR<UserCreateWithoutGuildMembersInput, UserUncheckedCreateWithoutGuildMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGuildMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGuildMembersInput, UserUncheckedUpdateWithoutGuildMembersInput>
  }

  export type UserUpdateWithoutGuildMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    mentees?: UserUpdateManyWithoutMentorNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGuildMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GuildUpsertWithoutMembersInput = {
    update: XOR<GuildUpdateWithoutMembersInput, GuildUncheckedUpdateWithoutMembersInput>
    create: XOR<GuildCreateWithoutMembersInput, GuildUncheckedCreateWithoutMembersInput>
    where?: GuildWhereInput
  }

  export type GuildUpdateToOneWithWhereWithoutMembersInput = {
    where?: GuildWhereInput
    data: XOR<GuildUpdateWithoutMembersInput, GuildUncheckedUpdateWithoutMembersInput>
  }

  export type GuildUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: StringFieldUpdateOperationsInput | string
    requiredLevel?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    slug?: StringFieldUpdateOperationsInput | string
    requiredLevel?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    mentees?: UserCreateNestedManyWithoutMentorInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    mentees?: UserUpdateManyWithoutMentorNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    mentees?: UserCreateNestedManyWithoutMentorInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    mentees?: UserUpdateManyWithoutMentorNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutQuizResultsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    mentees?: UserCreateNestedManyWithoutMentorInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutQuizResultsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
    missionSubmissions?: MissionSubmissionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutQuizResultsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutQuizResultsInput, UserUncheckedCreateWithoutQuizResultsInput>
  }

  export type UserUpsertWithoutQuizResultsInput = {
    update: XOR<UserUpdateWithoutQuizResultsInput, UserUncheckedUpdateWithoutQuizResultsInput>
    create: XOR<UserCreateWithoutQuizResultsInput, UserUncheckedCreateWithoutQuizResultsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutQuizResultsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutQuizResultsInput, UserUncheckedUpdateWithoutQuizResultsInput>
  }

  export type UserUpdateWithoutQuizResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    mentees?: UserUpdateManyWithoutMentorNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutQuizResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutMissionSubmissionsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentor?: UserCreateNestedOneWithoutMenteesInput
    mentees?: UserCreateNestedManyWithoutMentorInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    quizResults?: QuizResultCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMissionSubmissionsInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    mentorId?: string | null
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
    mentees?: UserUncheckedCreateNestedManyWithoutMentorInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    quizResults?: QuizResultUncheckedCreateNestedManyWithoutUserInput
    guildMembers?: GuildMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMissionSubmissionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMissionSubmissionsInput, UserUncheckedCreateWithoutMissionSubmissionsInput>
  }

  export type MissionCreateWithoutSubmissionsInput = {
    id?: string
    title: string
    description: string
    slug: string
    category: string
    difficulty?: number
    xp?: number
    weightBuilder?: number
    weightCreator?: number
    weightStrategist?: number
    weightCatalyst?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    title: string
    description: string
    slug: string
    category: string
    difficulty?: number
    xp?: number
    weightBuilder?: number
    weightCreator?: number
    weightStrategist?: number
    weightCatalyst?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionCreateOrConnectWithoutSubmissionsInput = {
    where: MissionWhereUniqueInput
    create: XOR<MissionCreateWithoutSubmissionsInput, MissionUncheckedCreateWithoutSubmissionsInput>
  }

  export type UserUpsertWithoutMissionSubmissionsInput = {
    update: XOR<UserUpdateWithoutMissionSubmissionsInput, UserUncheckedUpdateWithoutMissionSubmissionsInput>
    create: XOR<UserCreateWithoutMissionSubmissionsInput, UserUncheckedCreateWithoutMissionSubmissionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMissionSubmissionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMissionSubmissionsInput, UserUncheckedUpdateWithoutMissionSubmissionsInput>
  }

  export type UserUpdateWithoutMissionSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentor?: UserUpdateOneWithoutMenteesNestedInput
    mentees?: UserUpdateManyWithoutMentorNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMissionSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    mentorId?: NullableStringFieldUpdateOperationsInput | string | null
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MissionUpsertWithoutSubmissionsInput = {
    update: XOR<MissionUpdateWithoutSubmissionsInput, MissionUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<MissionCreateWithoutSubmissionsInput, MissionUncheckedCreateWithoutSubmissionsInput>
    where?: MissionWhereInput
  }

  export type MissionUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: MissionWhereInput
    data: XOR<MissionUpdateWithoutSubmissionsInput, MissionUncheckedUpdateWithoutSubmissionsInput>
  }

  export type MissionUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    weightBuilder?: FloatFieldUpdateOperationsInput | number
    weightCreator?: FloatFieldUpdateOperationsInput | number
    weightStrategist?: FloatFieldUpdateOperationsInput | number
    weightCatalyst?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    weightBuilder?: FloatFieldUpdateOperationsInput | number
    weightCreator?: FloatFieldUpdateOperationsInput | number
    weightStrategist?: FloatFieldUpdateOperationsInput | number
    weightCatalyst?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyMentorInput = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    level?: number
    experience?: number
    class?: string | null
    role?: string
    createdAt: Date | string
    updatedAt: Date | string
    pseudo?: string | null
    bio?: string | null
    country?: string | null
    city?: string | null
    language?: string
    ageRange?: string | null
    currentSituation?: string | null
    technicalLevel?: string | null
    domains?: UserCreatedomainsInput | string[]
    tools?: UserCreatetoolsInput | string[]
    githubUrl?: string | null
    portfolioUrl?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    mainObjective?: string | null
    secondaryObjectives?: UserCreatesecondaryObjectivesInput | string[]
    dominantMotivation?: string | null
    longTermObjective?: string | null
    preferredRhythm?: string | null
    onboardingSpeed?: number | null
    answerConsistency?: number | null
    connectionFrequency?: number | null
    dashboardActivity?: number | null
    communityEngagement?: number | null
    builderScore?: number
    creatorScore?: number
    strategistScore?: number
    catalystScore?: number
    polarization?: number
    profileStability?: number
    cohortsJoined?: UserCreatecohortsJoinedInput | string[]
    collaborativeProjects?: UserCreatecollaborativeProjectsInput | string[]
    projectsRealized?: UserCreateprojectsRealizedInput | string[]
    activePaths?: UserCreateactivePathsInput | string[]
    badges?: UserCreatebadgesInput | string[]
    missionsCompletedCount?: number
    recommendedPath?: UserCreaterecommendedPathInput | string[]
    recommendedTools?: UserCreaterecommendedToolsInput | string[]
    predictedEngagementScore?: number | null
    confidenceScore?: number
    profileDrift?: number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: Date | string | null
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt: Date | string
    updatedAt: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AccountCreateManyUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type QuizResultCreateManyUserInput = {
    id?: string
    profileType: string
    score?: number | null
    answers: JsonNullValueInput | InputJsonValue
    averageResponseTime?: number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GuildMemberCreateManyUserInput = {
    id?: string
    guildId: string
    role?: string
    joinedAt?: Date | string
  }

  export type MissionSubmissionCreateManyUserInput = {
    id?: string
    missionId: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutMentorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUpdateManyWithoutMentorNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMentorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    mentees?: UserUncheckedUpdateManyWithoutMentorNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    quizResults?: QuizResultUncheckedUpdateManyWithoutUserNestedInput
    guildMembers?: GuildMemberUncheckedUpdateManyWithoutUserNestedInput
    missionSubmissions?: MissionSubmissionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutMentorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    experience?: IntFieldUpdateOperationsInput | number
    class?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pseudo?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    ageRange?: NullableStringFieldUpdateOperationsInput | string | null
    currentSituation?: NullableStringFieldUpdateOperationsInput | string | null
    technicalLevel?: NullableStringFieldUpdateOperationsInput | string | null
    domains?: UserUpdatedomainsInput | string[]
    tools?: UserUpdatetoolsInput | string[]
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    portfolioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mainObjective?: NullableStringFieldUpdateOperationsInput | string | null
    secondaryObjectives?: UserUpdatesecondaryObjectivesInput | string[]
    dominantMotivation?: NullableStringFieldUpdateOperationsInput | string | null
    longTermObjective?: NullableStringFieldUpdateOperationsInput | string | null
    preferredRhythm?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingSpeed?: NullableIntFieldUpdateOperationsInput | number | null
    answerConsistency?: NullableFloatFieldUpdateOperationsInput | number | null
    connectionFrequency?: NullableFloatFieldUpdateOperationsInput | number | null
    dashboardActivity?: NullableFloatFieldUpdateOperationsInput | number | null
    communityEngagement?: NullableFloatFieldUpdateOperationsInput | number | null
    builderScore?: IntFieldUpdateOperationsInput | number
    creatorScore?: IntFieldUpdateOperationsInput | number
    strategistScore?: IntFieldUpdateOperationsInput | number
    catalystScore?: IntFieldUpdateOperationsInput | number
    polarization?: FloatFieldUpdateOperationsInput | number
    profileStability?: FloatFieldUpdateOperationsInput | number
    cohortsJoined?: UserUpdatecohortsJoinedInput | string[]
    collaborativeProjects?: UserUpdatecollaborativeProjectsInput | string[]
    projectsRealized?: UserUpdateprojectsRealizedInput | string[]
    activePaths?: UserUpdateactivePathsInput | string[]
    badges?: UserUpdatebadgesInput | string[]
    missionsCompletedCount?: IntFieldUpdateOperationsInput | number
    recommendedPath?: UserUpdaterecommendedPathInput | string[]
    recommendedTools?: UserUpdaterecommendedToolsInput | string[]
    predictedEngagementScore?: NullableFloatFieldUpdateOperationsInput | number | null
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    profileDrift?: FloatFieldUpdateOperationsInput | number
    behavioralVibrancy?: NullableJsonNullValueInput | InputJsonValue
    lastHypothesisUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizResultUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizResultUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizResultUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileType?: StringFieldUpdateOperationsInput | string
    score?: NullableIntFieldUpdateOperationsInput | number | null
    answers?: JsonNullValueInput | InputJsonValue
    averageResponseTime?: NullableIntFieldUpdateOperationsInput | number | null
    detailedResponseTimes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guild?: GuildUpdateOneRequiredWithoutMembersNestedInput
  }

  export type GuildMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    guildId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mission?: MissionUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type MissionSubmissionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    missionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    missionId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionCreateManyMissionInput = {
    id?: string
    userId: string
    status?: string
    content?: string | null
    projectDescription?: string | null
    userDifficulty?: number | null
    userRating?: number | null
    userFeedback?: string | null
    improvementSuggestions?: string | null
    reviewerFeedback?: string | null
    xpAwarded?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MissionSubmissionUpdateWithoutMissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMissionSubmissionsNestedInput
  }

  export type MissionSubmissionUncheckedUpdateWithoutMissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionSubmissionUncheckedUpdateManyWithoutMissionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    projectDescription?: NullableStringFieldUpdateOperationsInput | string | null
    userDifficulty?: NullableIntFieldUpdateOperationsInput | number | null
    userRating?: NullableIntFieldUpdateOperationsInput | number | null
    userFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    improvementSuggestions?: NullableStringFieldUpdateOperationsInput | string | null
    reviewerFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    xpAwarded?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberCreateManyGuildInput = {
    id?: string
    userId: string
    role?: string
    joinedAt?: Date | string
  }

  export type GuildMemberUpdateWithoutGuildInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGuildMembersNestedInput
  }

  export type GuildMemberUncheckedUpdateWithoutGuildInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuildMemberUncheckedUpdateManyWithoutGuildInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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