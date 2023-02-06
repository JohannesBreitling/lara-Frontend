import type { Organizer } from "@/model/Organizer";
import BasicApiCaller from "../BasicApiCaller";
import type { UserCategory } from "@/model/UserCategory";

export class AdminApiCaller {
    static urlUsermanagement = '/usermanagement';
    static urlCategory = '/category';

    public static getUsers(organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement, {
            data: {
                "organizers": organizers
            }
        });
    }

    public static createUser(username: string, password: string, userCategory: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement, {
            "username": username,
            "password": password,
            "usercategory": userCategory
        });
    }

    public static updateUser(userId: string, username: string, password: string, userCategoryName: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlUsermanagement + '/' + userId, {
            "username": username,
            "password": password,
            "usercategory": userCategoryName
        });
    }

    public static deleteUser(userId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlUsermanagement + '/' + userId);
    }

    public static getUserCategories() {
        return BasicApiCaller.axiosInstance.get(this.urlUsermanagement + this.urlCategory);
    }

    public static createUserCategory(name: string, color: string) {
        return BasicApiCaller.axiosInstance.post(this.urlUsermanagement + this.urlCategory, {
            "name": name,
            "color": color
        });
    }

    public static updateUserCategory(userCategoryId: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlUsermanagement + this.urlCategory + '/' + userCategoryId, {
                "name": name,
                "color": color
        });
    }

    public static deleteUserCategory(userCategoryId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlUsermanagement + this.urlCategory + '/' + userCategoryId);
    }
}
