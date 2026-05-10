import { RunDetailsClient } from "./client";

export default async function RunDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <RunDetailsClient id={id} />;
}