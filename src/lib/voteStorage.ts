import type { VoteData, VoteResult } from "@/types/api";

// Valid voting options
export const VALID_VOTE_OPTIONS = ["A", "B", "C"] as const;
export type VoteOption = (typeof VALID_VOTE_OPTIONS)[number];

class Storage {
  private votes: VoteData = { A: 0, B: 0, C: 0 };

  public isValidVoteOption(option: string): option is VoteOption {
    return VALID_VOTE_OPTIONS.includes(option as VoteOption);
  }

  // castVote Function
  public castVote(option: VoteOption): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // socket.emit("vote", selectedOption)
        const updatedVotesString = JSON.stringify(this.votes[option]++);

        localStorage.setItem("Votes", updatedVotesString); // can't store obj in localstorage we need to convert to stringify
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  // Get Votes Function
  public getVote() {
    try {
      const updatedVotes = localStorage.getItem("Votes");
      if (updatedVotes !== null) {
        this.votes = JSON.parse(updatedVotes);
        return this.votes;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error Occured while getting current Votes", error);
    }
  }

  /**
   * Get total vote count
   */
  public getTotalVotes(votes?: VoteData): number {
    const voteData = votes || this.votes;
    return voteData.A + voteData.B + voteData.C;
  }

  /**
   * Get complete vote result with counts, total, and percentages
   */
  public calculatePercentages(votes: VoteData): { A: number; B: number; C: number } {
    const total = this.getTotalVotes(votes);

    if (total === 0) {
      return { A: 0, B: 0, C: 0 };
    }

    return {
      A: Math.round((votes.A / total) * 100),
      B: Math.round((votes.B / total) * 100),
      C: Math.round((votes.C / total) * 100),
    };
  }

  /**
   * Get complete vote result with counts, total, and percentages
   */
  public getVoteResult(): VoteResult | undefined {
    const votes = this.getVote();
    if (votes !== null && votes !== undefined) {
      const total = this.getTotalVotes(votes);
      const percentages = this.calculatePercentages(votes);

      return {
        votes,
        total,
        percentages,
      };
    }
    return;
  }
}

export const VoteStorage = new Storage();