from typing import Generic, TypeVar, List, Optional, Dict, Any, Callable

T = TypeVar("T")

class MockRepository(Generic[T]):
    """
    Generic Repository Abstraction using in-memory store.
    Provides clean get_all, get_by_id, create, update, delete interface
    that can be swapped with SQLAlchemy/PostGIS repository in later phases.
    """
    def __init__(self, initial_data: List[Dict[str, Any]], id_field: str = "id"):
        self.id_field = id_field
        self._store: Dict[str, Dict[str, Any]] = {
            item[id_field]: dict(item) for item in initial_data if id_field in item
        }

    def get_all(self, filter_fn: Optional[Callable[[Dict[str, Any]], bool]] = None) -> List[Dict[str, Any]]:
        items = list(self._store.values())
        if filter_fn:
            items = [item for item in items if filter_fn(item)]
        return [dict(item) for item in items]

    def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        found = self._store.get(item_id)
        return dict(found) if found else None

    def create(self, item: Dict[str, Any]) -> Dict[str, Any]:
        item_id = item.get(self.id_field)
        if not item_id:
            raise ValueError(f"Item must contain '{self.id_field}'")
        self._store[item_id] = dict(item)
        return dict(item)

    def update(self, item_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        existing = self._store.get(item_id)
        if not existing:
            return None
        existing.update(updates)
        self._store[item_id] = existing
        return dict(existing)

    def delete(self, item_id: str) -> bool:
        if item_id in self._store:
            del self._store[item_id]
            return True
        return False
