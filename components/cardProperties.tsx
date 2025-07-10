import { CardType } from "@/types/CardType";

const CardProperties: React.FC<{card: CardType}> = ({ card }) => {
    return (
        <div className="flex flex-col w-200 h-140 bg-[#192131]/70 rounded-lg text-white">
            <div className="flex items-center pl-8 pt-6 w-full h-15">
                <h1 className="text-2xl">Card Properties</h1>
            </div>
            <hr className="m-2 text-white/25"></hr>
            <div className="flex w-full h-full">
                <div className="w-120">
                    <img src={card.image_uris?.png} className="w-65 ml-10 mt-7"/>
                    <div className="flex ml-5 w-full h-8 justify-center">
                         <p className="ml-2">${card.prices.usd}</p>
                    </div>
                    <a href={card.scryfallUri} target="_blank" className="ml-28">View on Scryfall</a>
                </div>
                <div className="w-full">
                    <div className="flex w-full justify-center mt-5">
                        <h2 className="text-2xl">{card.card_name}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProperties;