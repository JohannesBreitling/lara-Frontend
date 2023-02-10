import basicApiCaller from "../BasicApiCaller";
import type { Organizer } from "@/model/Organizer";

export class PaperApiCaller {
    static urlPath = '/paper/';
    static urlTag = '/tag';
    static urlComment = '/comment';
    static urlSaveState = '/save-state';
    static urlRelevance = '/relevance';
    static urlRecommendations = '/recommendations';

    public static getDetails(paperId: string, researchId?: string) {
        if (researchId == null) {
            return basicApiCaller.axiosInstance.get(this.urlPath + paperId);
        } else {
            return basicApiCaller.axiosInstance.get(this.urlPath + paperId, {
                params: {
                    "researchId": researchId
                }
            })
        }
    }

    public static addTag(paperId: string, researchId: string, tagId: string) {
        console.debug("tagId:", tagId)
        return basicApiCaller.axiosInstance.put(this.urlPath + paperId + this.urlTag, {}, {
            params: {
                "researchId": researchId,
                "tagId": tagId
            }
        });
    }
    
    public static removeTag(paperId: string, researchId: string, tagId: string) {
        return basicApiCaller.axiosInstance.delete(this.urlPath + paperId + this.urlTag, {
            params: {
                "researchId": researchId,
                "tagId": tagId
            }
        })
    }
    
    public static changeComment(paperId: string, researchId: string, comment: string) {
        return basicApiCaller.axiosInstance.patch(this.urlPath + paperId + this.urlComment, {
                "comment": comment
            }, {
                params: {
                    "researchId": researchId
                }
            }
        );
    }

    public static changeSaveState(paperId: string, researchId: string, saveState: string) {
        return basicApiCaller.axiosInstance.put(this.urlPath + paperId + this.urlSaveState, {}, {
            params: {
                "researchId": researchId,
                "save-state": saveState
            }
        });
    }

    public static changeRelevance(paperId: string, researchId: string, relevance: number) {
        return basicApiCaller.axiosInstance.patch(this.urlPath + paperId + this.urlRelevance, {}, {
            params: {
                "researchId": researchId,
                "relevance": relevance
            }
        });
    }
    
    public static getRecommendationsOrReferencesOrCitations(paperId: string, researchId: string, method: string, organizers: Organizer[]) {
        return basicApiCaller.axiosInstance.post(this.urlPath + paperId + this.urlRecommendations, {
                "organizers": organizers
            }, {
                params: {
                    "researchId": researchId,
                    "method": method
                }
            }
        );
    }
}
