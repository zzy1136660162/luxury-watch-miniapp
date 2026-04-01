package com.luxurywatch.service;

import com.luxurywatch.dto.MiniLoginRequest;
import com.luxurywatch.dto.MiniLoginResponse;

public interface MiniLoginService {

    MiniLoginResponse login(MiniLoginRequest request, String ip);

    MiniLoginResponse getUserInfo(Long userId);
}
