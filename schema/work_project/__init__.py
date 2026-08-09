"""Work project schemas."""

import json
from typing import Any


def accept_json_string(value: Any) -> Any:
    """Tolerate models that pass nested objects as a JSON string.

    Some LLM function-calling implementations serialize nested object
    arguments into a JSON string (e.g. the `finding` argument arrives as
    '{"title": ...}' instead of a dict). Pydantic then rejects the str
    against the model type and the SDK raises ModelBehaviorError, which
    crashes the tool call. This before-validator parses such strings so
    the nested object is accepted. Non-string input and invalid JSON are
    passed through unchanged, so validation behavior is otherwise unchanged.
    """
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (ValueError, TypeError):
            return value
    return value
