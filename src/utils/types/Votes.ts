type Vote = {
	id: number;
	voter_id: string;
	candidate_id: string;
	position: string;
	time_casted: Date;
	election_id: string;
};

export { Vote };