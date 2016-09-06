defmodule FatmanGo.Place do
  @derive [Poison.Encoder]
  defstruct [:lat, :lon, :last_update]
end
