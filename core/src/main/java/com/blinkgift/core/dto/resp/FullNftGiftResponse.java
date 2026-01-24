package com.blinkgift.core.dto.resp;

import com.blinkgift.core.dto.getgems.GetGemsNftInfoResponse;
import com.blinkgift.core.dto.getgems.GetGemsItem;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FullNftGiftResponse {
    private GetGemsNftInfoResponse.NftItem info;
    private List<GetGemsItem> history;
}