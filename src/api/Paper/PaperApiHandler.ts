import BaseApiCaller from "../BaseApiCaller"
import { PaperApiCaller } from "./PaperApiCaller"

import { Paper } from "@/model/Paper"
import { Author } from "@/model/Author"
import type { SavedPaper } from "@/model/SavedPaper"
import type { Comment } from "@/model/Comment"
import type { Tag } from "@/model/Tag"
import { SaveState } from "@/model/SaveState"
import type { Organizer } from "@/model/Organizer"

export class PaperApiHandler { // what about JWT token?
    // old variant, yuck
    /*
    public static async getDetailsOfPaper(paperId: string): Promise<SavedPaper> {
        const response = await PaperApiCaller.getDetailsOfPaper(paperId)
            .then(res => {
                return res;
            });
               
        try {
            var json = JSON.parse(response);
        } catch(error) {
            throw new Error("Could not parse JSON string from backend: " + error);
        }

        let data = json["data"];
        if (json.status == "401") {
            throw new Error("User not authentificated: " + data["message"]);
        }
        if (json.status == "403") {
            throw new Error("Paper not found or paper does not belong to user :" + data["message"]);
        }
        
        try { // parsing not needed as our rest-api always responds in correct format (or errors 401 & 403 that were checked before)
            var research = data.research as Research;
            var comment = data.comment as Comment;
            var tags = data.tags.Children() as Tag[];
            var relevance = data.relevance as number;
            var saveState = data.saveState as SaveState;

            var title = data.title;
            var authors = data.authors.Children() as Author[];
            var year = data.year as number;
            var abstract = data.abstract;
            var citationCount = data.citationCount as number;
            var referenceCount = data.referenceCount as number;
            var venue = data.venue;
            var pdfUrl = data.pdfUrl;
        } catch(error) {
            throw new Error("JSON string is of wrong format: " + error);
        }

        let paper = new Paper(paperId, title, authors, year, abstract, citationCount, referenceCount, venue, pdfUrl);

        return new SavedPaper(paper, research, comment, tags, relevance, saveState);
    }
    */

    // new & improved variants
    public static getDetailsOfPaper(paper: Paper) {
        PaperApiCaller.getDetailsOfPaper(paper.id)
            .then(response => {
                let data = BaseApiCaller.tryParseJson(response.data);
                console.log("response of gedDetailsOfPaper: ", data);
                let paper = PaperApiHandler.buildPaper(data); // update html component here
            });
    }

    public static addTagToPaper(savedPaper: SavedPaper, tag: Tag) {
        PaperApiCaller.addTagToPaper(savedPaper.paper.id, savedPaper.research.id, tag.id)
            .then(response => {
                let data = BaseApiCaller.tryParseJson(response.data);
                console.log("response of addTagToPaper: ", data); // update html component here
            });
    }

    public static removeTagFromPaper(savedPaper: SavedPaper, tag: Tag) {
        PaperApiCaller.removeTagFromPaper(savedPaper.paper.id, savedPaper.research.id, tag.id)
            .then(response => {
                let data = BaseApiCaller.tryParseJson(response.data);
                console.log("response of removeTagFromPaper: ", data); // update html component here
            });
    }

    public static changeComment(savedPaper: SavedPaper, comment: Comment) {
        PaperApiCaller.changeComment(savedPaper.paper.id, savedPaper.research.id, comment.text)
        .then(response => {
            let data = BaseApiCaller.tryParseJson(response.data);
            console.log("response of changeComment: ", data); // update html component here
        });
    }

    public static changeSaveState(savedPaper: SavedPaper, saveState: SaveState) {
        PaperApiCaller.changeSaveState(savedPaper.paper.id, savedPaper.research.id, SaveState[saveState])
            .then(response => {
                let data = BaseApiCaller.tryParseJson(response.data);
                console.log("response of changeSaveState: ", data); // update html component here
            });
    }

    public static changeRelevance(savedPaper: SavedPaper, relevance: number) {
        PaperApiCaller.changeRelevance(savedPaper.paper.id, savedPaper.research.id, relevance)
            .then(response => {
                let data = BaseApiCaller.tryParseJson(response.data);
                console.log("response of changeRelevance: ", data); // update html component here
            });
    }

    public static getRecommendationsOfPaper(paper: Paper, method: RecommendationMethod, organizers: Organizer[]) {
        PaperApiCaller.getRecommendationsOfPaper(paper.id, RecommendationMethod[method], JSON.stringify(organizers))
            .then(response => {
                let data = BaseApiCaller.tryParseJson(response.data);
                console.log("response of changeSaveState: ", data); // update html component here
            });
    }

    public static getReferencesOfPaper(paper: Paper) {
        return // not defined in yaml
    }

    public static getCitationsOfPaper(paper: Paper) {
        return // not defined in yaml
    }

    
    // example helper methods

    private static buildPaper(data: any): Paper {
        let authors: Author[] = [];

        for (let authorJSON of data.authors) {
            let author = new Author(authorJSON.id, authorJSON.name);
            authors.push(author);
        }

        return new Paper(data.id, data.title, authors, +data.year, data.abstract, +data.citationCount, +data.referenceCount,
            data.venue, data.pdfUrl);
    }

    private static buildRecommendations(data: any): Paper[] {
        let recommendations: Paper[] = [];

        for (let paperJSON of data) {
            let authors: Author[] = [];
            for (let authorJSON of paperJSON.authors) {
                let author = new Author(authorJSON.id, authorJSON.name);
                authors.push(author);
            }

            let paper = new Paper(paperJSON.id, paperJSON.title, authors, +paperJSON.year, paperJSON.abstract,
                +paperJSON.citationCount, +paperJSON.referenceCount, paperJSON.venue, paperJSON.pdfUrl)
            recommendations.push(paper);
        }

        return recommendations;
    }
}
