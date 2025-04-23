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
            onEdit(null, editingIndex);
        }
        cancelEdit();
    };

    const renderField = (field, value, onChange) => {
        if (field === 'homeTeam' || field === 'awayTeam' || field === 'team1' || field === 'team2') {
            return (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent text-uiDark w-full rounded-md outline-[1px] outline-uiDark outline-none appearance-none pr-8 bg-[url('/chevron.svg')] bg-no-repeat bg-right bg-[length:1rem_1rem]"
                >
                    <option value="">Select Team</option>
                    {teamList.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.displayName}
                        </option>
                    ))}
                </select>
            );
        }
        if (field === 'date') {
            return (
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-uiLight text-uiDark w-full rounded-md outline-[1px] outline-uiDark outline-none"
                />
            );
        }
        if (field === 'time') {
            return (
                <input
                    type="time"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-uiLight text-uiDark w-full rounded-md outline-[1px] outline-uiDark outline-none"
                />
            );
        }
        return <input 
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)} 
            className='bg-uiLight text-uiDark w-full rounded-md outline-[1px] outline-uiDark outline-none'
        />;
    };

    return (
        <div className="overflow-auto">
            <table className="table table-fixed text-uiDark text-base">
                <thead>
                    <tr className="text-lg font-bold bg-uiDark text-uiBg">
                        {headers.map((header) => (
                            <th key={header} className="py-2">
                                {header}
                            </th>
                        ))}
                        {editable && <th className="py-2 w-32 text-center">Actions</th>}
                    </tr>
                </thead>
                <tbody className="cssZebraRow">
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-0">
                            {fields.map((field) => (
                                <td key={field} className="py-2">
                                    {editingIndex === idx ? (
                                        renderField(field, editedRow[field] || '', (value) => handleChange(field, value))
                                    ) : (
                                        teamFieldSelectionList.includes(field) ? (
                                            getTeamName(item[field]) || 'Unknown Team'
                                        ) : (
                                            item[field]
                                        )
                                    )}
                                </td>
                            ))}
                            {editable && (
                                <td className="py-2 space-x-2 whitespace-nowrap w-32 text-center">
                                    {editingIndex === idx ? (
                                        <>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                strokeWidth={1.5} 
                                                stroke="currentColor" 
                                                className="size-6 text-green-600 inline"
                                                onClick={saveEdit}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>

                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                strokeWidth={1.5} 
                                                stroke="currentColor" 
                                                className="size-6 text-gray-500 inline"
                                                onClick={cancelEdit}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>

                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                strokeWidth={1.5} 
                                                stroke="currentColor" 
                                                className="size-6 text-red-600 inline"
                                                onClick={deleteRow}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </>
                                    ) : (
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            strokeWidth={1.5} 
                                            stroke="currentColor" 
                                            className="size-6 text-uiDark inline"
                                            onClick={() => startEdit(idx)}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>

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