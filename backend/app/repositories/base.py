"""
BHOO-MITRA AI — Abstract Base Repository

Defines the generic CRUD contract that both MockRepository and
PostgresRepository must satisfy.  Services depend only on this interface.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Callable, Dict, Generic, List, Optional, TypeVar

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """
    Generic repository interface.

    Implementations:
        MockRepository     — in-memory dict store (existing, untouched)
        PostgresRepository — SQLAlchemy / PostGIS backed store (new)
    """

    @abstractmethod
    def get_all(
        self,
        filter_fn: Optional[Callable[[Dict[str, Any]], bool]] = None,
    ) -> List[Dict[str, Any]]:
        """Return all records, optionally filtered by a predicate."""
        ...

    @abstractmethod
    def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        """Return a single record by primary key, or None."""
        ...

    @abstractmethod
    def create(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Persist a new record and return it."""
        ...

    @abstractmethod
    def update(
        self, item_id: str, updates: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Apply partial updates to an existing record and return it."""
        ...

    @abstractmethod
    def delete(self, item_id: str) -> bool:
        """Delete a record.  Returns True if deleted, False if not found."""
        ...
