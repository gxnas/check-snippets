(async () => {
  const zonesUrl = "https://dash.cloudflare.com/api/v4/zones?type=full,partial,secondary&per_page=100";

  try {
    const zonesRes = await fetch(zonesUrl, { credentials: "include" });
    const zonesData = await zonesRes.json();

    const results = [];

    for (const zone of zonesData.result) {
      const entitlementsUrl = `https://dash.cloudflare.com/api/v4/zones/${zone.id}/entitlements`;
      const entRes = await fetch(entitlementsUrl, { credentials: "include" });
      const entData = await entRes.json();

      // 找 feature.key === "rulesets.snippets_rule_max"
      const rule = entData.result.find(r => r.feature?.key === "rulesets.snippets_rule_max");

      const value = rule ? rule.allocation.value : 0;
      if (value > 0) {
        results.push({
          zone_id: zone.id,
          zone_name: zone.name,
          rulesets_snippets_rule_max: value
        });
      }
    }

    console.log(results);
  } catch (err) {
    console.error("请求失败:", err);
  }
})();
