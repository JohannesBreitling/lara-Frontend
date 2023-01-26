import BasicApiHandler from "../BasicApiHandler";
import { ExportApiCaller } from "./ExportApiCaller";
import type { Research } from "@/model/Research";
import type { Organizer } from "@/model/Organizer";
import type { Paper } from "@/model/Paper";

export class ExportApiHandler {
    public static async exportResearch(research: Research, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ExportApiCaller.exportResearch(research.id, organizers.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        return data.export;
    }

    public static async exportPaper(paper: Paper): Promise<unknown[]> {
        const response = await ExportApiCaller.exportPaper(paper.id);
        let data = BasicApiHandler.tryParseJson(response.data);
        return data.export;
    }
}
