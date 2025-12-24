"""Demo comparison between Traditional LLM and Parlant agent responses."""
import asyncio
from rich_table_formatter import print_comparison_rich
from traditional_llm_prompt import call_traditional_llm as traditional_call, TRADITIONAL_HUGE_PROMPT
from parlant_client_utils import (
    create_client as create_parlant_client,
    create_session as create_parlant_session,
    send_user_message as send_parlant_user_message,
    await_ai_reply as await_parlant_ai_reply,
    get_session_reasoning as get_parlant_reasoning,
)


async def main() -> None:
    """Compare Traditional LLM vs Parlant agent responses."""
    from config import DEMO_QUERIES
    demo_queries = DEMO_QUERIES

    import os
    import pathlib
    # parlant-data is now in backend/ directory
    agent_id_path = pathlib.Path(__file__).parent / "parlant-data" / "agent_id.txt"
    if not agent_id_path.exists():
        raise RuntimeError("agent_id.txt not found. Please start parlant_agent_server.py first.")
    with open(agent_id_path, "r", encoding="utf-8") as f:
        agent_id = f.read().strip()

    client = await create_parlant_client()
    rows = []
    
    for i, query in enumerate(demo_queries, 1):
        print(f"🔄 Processing query {i}/{len(demo_queries)}: {query[:50]}...")
        
        session_id = await create_parlant_session(client, agent_id)
        
        print("  📝 Getting traditional LLM response...")
        traditional_response = await traditional_call(query, TRADITIONAL_HUGE_PROMPT)
        
        print("  🤖 Getting Parlant agent response...")
        customer_event_offset = await send_parlant_user_message(client, session_id, query)
        min_offset = customer_event_offset + 1
        parlant_response = await await_parlant_ai_reply(client, session_id, min_offset) or "Error: No AI reply received from Parlant session."
        reasoning = await get_parlant_reasoning(client, session_id, min_offset)

        print(f"  ✅ Query {i} complete")
        rows.append([query, traditional_response, parlant_response, reasoning])

    print_comparison_rich([], rows)


if __name__ == "__main__":
    asyncio.run(main())
