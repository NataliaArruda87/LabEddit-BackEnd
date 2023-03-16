import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
   public static TABLE_USERS = "users"
    
    public getAllUsers = async () => {
        const userDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()

        return userDB
    }

    public getUsersById = async (id: string): Promise<UserDB | undefined>  => {
        const [userDB] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({id})

        return userDB
    }

    public async findUsers(q: string | undefined | unknown) {
        let usersDB

        if (q) {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)

            usersDB = result
        } else {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)

            usersDB = result
        }

        return usersDB
    }

    public async findUserByEmail(email: string) {
        const [ userDB ]: UserDB[] | undefined[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ email })

        return userDB
    }

    public async insertUser(newUserDB: UserDB) {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }
}