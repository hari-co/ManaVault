import { CardType } from "@/types/CardType";

interface NotesSectionProps {
    card: CardType;
    notes: string;
    onNotesChange: (value: string) => void;
    onNotesSubmit: (card: CardType, notes: string, e: React.FormEvent | React.FocusEvent<HTMLTextAreaElement>) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ 
    card, 
    notes, 
    onNotesChange, 
    onNotesSubmit 
}) => {
    return (
        <div>
            <h2>Notes</h2>
            <form
                className="flex w-83 h-45 rounded-xl items-center"
                onSubmit={e => {
                    e.preventDefault();
                    onNotesSubmit(card, notes, e);
                }}>
                <textarea
                    className="w-full h-full bg-gray-700/40 border border-gray-600 rounded-xl p-2 resize-none text-white"
                    value={notes}
                    placeholder="Type notes here..."
                    onChange={e => onNotesChange(e.target.value)}
                    onBlur={e => onNotesSubmit(card, e.target.value, e)}
                />
            </form>
        </div>
    );
};

export default NotesSection;
