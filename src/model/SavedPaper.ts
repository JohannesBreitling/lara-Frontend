import type { Paper } from "./Paper";
import type { Comment } from "./Comment";
import type { Tag } from "./Tag";
import type { SaveState } from "./SaveState";
import type { Research } from "./Research";

// Model-class of a savedPaper
export class SavedPaper {
    readonly paper: Paper;
    readonly research: Research;
    readonly comment: Comment;
    readonly tags: Tag[];
    readonly relevance: number;
    readonly saveState: SaveState;

    constructor(paper: Paper, research: Research, comment: Comment, tags: Tag[], relevance: number, saveState: SaveState) {
        this.paper = paper;
        this.research = research;
        this.comment = comment;
        this.tags = tags;
        this.relevance = relevance;
        this.saveState = saveState;
    }
}
