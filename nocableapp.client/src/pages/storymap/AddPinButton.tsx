import { GeoAltFill } from "react-bootstrap-icons";
import { MapUtils } from "../../utils/MapUtils";
import { useMap } from "../../contexts/MapProvider";
import { useEffect, useState } from "react";
import { Coordinate } from "ol/coordinate";
//import { reverseGeocode } from "../../api/photon";

interface Props {
  selectedPlace: Coordinate | null;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Coordinate | null>>;
}
enum AddPinStatus {
  addingPin,
  clearingPin,
  inactive,
}

function AddPinButton({ selectedPlace, setSelectedPlace }: Props) {
  const { map } = useMap();
  const [toolStatus, setToolStatus] = useState<AddPinStatus>(
    AddPinStatus.inactive,
  );
  const title =
    toolStatus == AddPinStatus.inactive
      ? "Click to Add Pin"
      : toolStatus == AddPinStatus.addingPin
        ? "Drop Pin"
        : "Remove Pin";
  useEffect(() => {
    if (selectedPlace && toolStatus === AddPinStatus.inactive) {
      setToolStatus(AddPinStatus.clearingPin);
      return;
    }
    if (!map || toolStatus !== AddPinStatus.addingPin) return;

    const handleMapClick = async (e: { pixel: [number, number] }) => {
      const coord = map.getCoordinateFromPixel(e.pixel);
      setSelectedPlace(coord);
      setToolStatus(AddPinStatus.clearingPin);
      map.getTargetElement().style.cursor = "";
    };

    map.on("click", handleMapClick as never);
    return () => {
      map.un("click", handleMapClick as never);
    };
  }, [map, toolStatus, selectedPlace]);
  const handlePinDropToggle = () => {
    // if place is set on map clear it

    switch (toolStatus) {
      case AddPinStatus.inactive:
        // set status to adding pin and update cursor
        setToolStatus(AddPinStatus.addingPin);
        map!.getTargetElement().style.cursor = `url('${MapUtils.pinSvgDataUrl("#2b09ee", 30)}') 15 30, crosshair`;
        break;
      case AddPinStatus.addingPin:
        // set to inactive and return to normal state
        setToolStatus(AddPinStatus.inactive);
        map!.getTargetElement().style.cursor = "";
        break;
      case AddPinStatus.clearingPin:
        setSelectedPlace(null);
        setToolStatus(AddPinStatus.inactive);
        map!.getTargetElement().style.cursor = "";
        break;
      default:
      // code block
    }
  };
  return (
    <button
      onClick={handlePinDropToggle}
      title={title}
      style={{
        padding: "8px 10px",
        ...(toolStatus !== AddPinStatus.inactive
          ? { background: "#0d6efd", color: "white" }
          : {}),
      }}
    >
      <GeoAltFill size={22} />
    </button>
  );
}

export default AddPinButton;
