import CardSearch from '../../../components/cardsearch';

export default function Library() {
    return (
        <>
            <div className='bg-green-600 flex flex-col'>
                <h1 className="font-bold text-5xl py-6">Library</h1>
                <CardSearch />
            </div>
            <div className='flex flex-col bg-amber-500'>
                <p>hello</p>
            </div>
        </>
    );
}