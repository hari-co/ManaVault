import { Timestamp } from "firebase/firestore";

export type CardType = {
    id: string;
    card_name: string;
    image_uris?: {
        art_crop: string,
        border_crop: string,
        large: string,
        normal: string,
        png: string,
        small: string
    };
    add_date: Timestamp | Date;
    last_price_update: Timestamp | Date;
    binder: string | null;
    scryfallId: string;
    tcgplayerId: string | null;
    tcgplayerEtchedId: string | null;
    cardMarketId: string | null;
    lang: string;
    layout: string;
    uri: string;
    scryfallUri: string;
    prints_search_uri: string;
    all_parts: { name: string }[];
    card_faces: { name: string }[];
    cmc: number;
    color_identity: string[];
    color_indicator: string[] | null;
    colors: string[];
    defense: string | null;
    edhrank: number | null;
    game_changer: boolean | null;
    keywords: string[];
    legality: any;
    loyalty: string | null;
    mana_cost: string;
    oracle_text: string;
    power: string | null;
    produced_mana: string[] | null;
    reserved: boolean;
    toughness: string | null;
    type_line: string;
    artist: string;
    frame: string;
    frame_effects: string[] | null;
    full_art: boolean;
    oversized: boolean;
    prices: any;
    promo: boolean;
    rarity: string;
    reprint: boolean;
    scryfall_set: string;
    set_name: string;
    set: string;
    variation: boolean;
    variation_of: string | null;
    collector_number?: string;
}