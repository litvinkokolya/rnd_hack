export interface IMemberNomination {
  id: number;
  nomination: string;
  nomination_info: any;
  category: string;
  member: string;
  result_sum: number;
  is_done: boolean;
}

export interface ICategoryNomination {
  event_category: number;
  nomination: number;
  member_nomination: IMemberNomination[];
}

export interface IChamp {
  id: number;
  name: string;
  win_nominations: ICategoryNomination[];
  role: string;
  image: string;
  count_photo: string;
  criteries: string[];
}

export interface ChampCardProps {
  champ: IChamp;
  refetch: () => void;
  disableChamp: boolean;
}

export interface IChampNominationsCategories {
  name: string;
  members: Array<{
    member: string;
    result_all: number;
  }>;
}
