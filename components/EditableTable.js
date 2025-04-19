'use client';

// IMPORT
import { useState } from 'react';

// COMPONENT
export default function EditableTable({ items, teamList, fields, headers, editable = false, onEdit, getTeamName }) {
    const teamFieldSelectionList = ["team1", "team2", "homeTeam", "awayTeam"];

    const [editingIndex, setEditingIndex] = useState(null);
    const [editedRow, setEditedRow] = useState({});

    const startEdit = (index) => {
        setEditingIndex(index);
        setEditedRow({ ...items[index] });
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditedRow({});
    };

    const handleChange = (field, value) => {
        setEditedRow((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveEdit = () => {
        if (onEdit) {
            onEdit(editedRow, editingIndex);
        }
        cancelEdit();
    };

    const deleteRow = () => {
        if (onEdit) {
            onEdit(null, editingIndex); // null signals deletion
        }
        cancelEdit();
    };

    return (
        <div className="overflow-x-auto border border-gray-300 rounded-xl">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-uiDark text-uiLight">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} className="px-4 py-2 text-left capitalize">
                                {header}
                            </th>
                        ))}
                        {editable && <th className="px-4 py-2 max-w-fit">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx} className="odd:bg-white even:bg-gray-100">
                            {fields.map((field) => (
                                <td key={field} className="px-4 py-2">
                                    {editingIndex === idx ? (
                                        // Render dropdowns for team fields (except "displayName")
                                        teamFieldSelectionList.includes(field) ? (
                                            <select
                                                value={editedRow[field] || ''}
                                                onChange={(e) => handleChange(field, e.target.value)}
                                                className="border rounded px-2 py-1 w-full"
                                            >
                                                <option value="">Select Team</option>
                                                {teamList.map(team => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.displayName}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            // Render textboxes for non-team fields or "displayName"
                                            <input
                                                type="text"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editedRow[field] || ''}
                                                onChange={(e) => handleChange(field, e.target.value)}
                                            />
                                        )
                                    ) : (
                                        // Display team names for team fields or raw values for others
                                        teamFieldSelectionList.includes(field) ? (
                                            getTeamName(item[field]) || 'Unknown Team'
                                        ) : (
                                            item[field]
                                        )
                                    )}
                                </td>
                            ))}
                            {editable && (
                                <td className="px-4 py-2 space-x-2 whitespace-nowrap max-w-fit">
                                    {editingIndex === idx ? (
                                        <>
                                            <button
                                                onClick={saveEdit}
                                                className="text-green-600 hover:underline"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="text-gray-500 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={deleteRow}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => startEdit(idx)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}