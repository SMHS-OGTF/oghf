'use client';

// COMPONENT
export default function EditableCardList({ items, fields, editable = false, onEdit }) {
    return (
        <div className="grid gap-2 w-full">
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="flex gap-4 flex-wrap text-uiDark">
                        {fields.map(field => (
                            <div key={field} className="min-w-[100px]">
                                <span className="font-semibold">{field}:</span> {item[field]}
                            </div>
                        ))}
                    </div>
                    {editable && (
                        <button
                            className="bg-uiDark text-uiLight px-3 py-1 rounded-lg hover:brightness-110"
                            onClick={() => onEdit(item)}
                        >
                            Edit
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
