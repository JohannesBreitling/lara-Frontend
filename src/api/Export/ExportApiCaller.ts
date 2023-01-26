import BasicApiCaller from "../BasicApiCaller";

export class ExportApiCaller {
    static urlExport = '/export';
    static urlResearch = '/research/';
    static urlPaper = '/paper/';

    public static exportResearch(researchId: string, organizers: string) {
        return BasicApiCaller.axiosInstance.post(this.urlExport + this.urlResearch + researchId, {
                "organizers": organizers
            }
        );
    }

    public static exportPaper(paperId: string) {
        return BasicApiCaller.axiosInstance.get(this.urlExport + this.urlPaper + paperId);
    }
}
