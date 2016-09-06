defmodule FatmanGo.PlaceChannel do
  use FatmanGo.Web, :channel

  alias FatmanGo.Place

  def join("places:lobby", _params, socket) do
    send(self, :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    with {:ok, file}          <- File.read("priv/places.json"),
         {:ok, place_structs} <- Poison.Parser.parse(file, keys: :atoms),
         places               <- Enum.map(place_structs, &struct(Place, &1)),
         stream               <- Stream.cycle(places),
         _                    <- Enum.map(stream, &push_socket(&1, socket)),
    do: {:noreply, socket}
  end

  defp push_socket(place, socket) do
    :timer.sleep(400)
    push socket, "update_place", place
  end
end
