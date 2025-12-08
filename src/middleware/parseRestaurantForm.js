const parseRestaurantForm = (req, res, next) => {
  try {
    if (
      req.body["location[address]"] ||
      req.body["location.lat"] ||
      req.body["location.lng"]
    ) {
      req.body.location = {
        address: req.body["location[address]"] || req.body["location.address"] || "",
        lat: req.body["location[lat]"] || req.body["location.lat"] || "",
        lng: req.body["location[lng]"] || req.body["location.lng"] || "",
      };

      delete req.body["location[address]"];
      delete req.body["location[lat]"];
      delete req.body["location[lng]"];
      delete req.body["location.address"];
      delete req.body["location.lat"];
      delete req.body["location.lng"];
    }

    if (req.body.isOpen !== undefined) {
      req.body.isOpen = String(req.body.isOpen).trim() === "true";
    }

    next();
  } catch (err) {
    console.log("parseRestaurantForm error:", err);
    next(err);
  }
};

module.exports= parseRestaurantForm;
