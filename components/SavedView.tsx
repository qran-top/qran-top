import React from 'react';
import type { Collections } from '../types';
import CollectionListView from './saved/CollectionListView';
import CollectionDetailView from './saved/CollectionDetailView';

interface SavedViewProps {
    collections: Collections;
    collectionId: string | null;
    onDeleteCollection: (collectionId: string) => void;
    onDeleteSavedItem: (collectionId: string, itemId: string) => void;
    onUpdateNotes: (collectionId: string, itemId: string, notes: string) => void;
}

const SavedView: React.FC<SavedViewProps> = ({ collections, collectionId, onDeleteCollection, onDeleteSavedItem, onUpdateNotes }) => {
    
    // Detailed view for a single collection
    if (collectionId && collections[collectionId]) {
        const collection = collections[collectionId];
        return (
            <CollectionDetailView 
                collection={collection}
                onDeleteCollection={onDeleteCollection}
                onDeleteSavedItem={onDeleteSavedItem}
                onUpdateNotes={onUpdateNotes}
            />
        );
    }

    // Main view for all collections
    return (
        <CollectionListView collections={collections} />
    );
};

export default SavedView;
