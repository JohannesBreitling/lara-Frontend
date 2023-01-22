import BaseApiCaller from "../BaseApiCaller";

export class PaperApiCaller {
    static urlPath = '/paper/';

    // old variant, yuck
    /*
    public static async getDetailsOfPaper(paperId: string): Promise<string> {
        return await BaseApiCaller.axiosInstance.get(PaperApiCaller.urlPath + paperId)
            .then(response => {
                return JSON.stringify(response);
            })
            .catch(error => {
                console.log(error);
                return '{}';
            });
    }
    */

   // new & improved variants
    public static getDetailsOfPaper(paperId: string) {
        return BaseApiCaller.axiosInstance.get(PaperApiCaller.urlPath + paperId);
    }

    public static addTagToPaper(paperId: string, researchId: string, tagId: string) {
        return BaseApiCaller.axiosInstance.put(PaperApiCaller.urlPath + paperId + '/tag', {
            params: {
                "researchId": researchId,
                "tagId": tagId
            }
        });
    }
    
    public static removeTagFromPaper(paperId: string, researchId: string, tagId: string) {
        return BaseApiCaller.axiosInstance.delete(PaperApiCaller.urlPath + paperId + "'/tag", {
            params: {
                "researchId": researchId,
                "tagId": tagId
            }
        })
    }
    
    public static changeComment(paperId: string, researchId: string, comment: string) {
        return BaseApiCaller.axiosInstance.patch(PaperApiCaller.urlPath + paperId + '/comment', {
            params: {
                "researchId": researchId
            },
            data: {
                "comment": comment
            }
        });
    }

    public static changeSaveState(paperId: string, researchId: string, saveState: string) {
        return BaseApiCaller.axiosInstance.put(PaperApiCaller.urlPath + paperId + '/save-state', {
            params: {
                "researchId": researchId,
                "save-state": saveState
            }
        });
    }

    public static changeRelevance(paperId: string, researchId: string, relevance: number) {
        return BaseApiCaller.axiosInstance.patch(PaperApiCaller.urlPath + paperId + '/relevance', {
            params: {
                "researchId": researchId,
                "relevance": relevance
            }
        });
    }
    
    public static getRecommendationsOfPaper(paperId: string, method: string, organizerList: string) {
        return BaseApiCaller.axiosInstance.post(PaperApiCaller.urlPath + paperId, {
            params: {
                "method": method
            },
            data : {
                "organizers": organizerList
            }
        });
    }

    public static getReferencesOfPaper(paperId: string) {
        return // not defined in yaml
    }

    public static getCitationsOfPaper(paperId: string) {
        return // not defined in yaml
    }
}
