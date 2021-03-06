# 프로젝트 소개 

### 본 프로젝트는 HCI를 활용해 서비스의 사용성을 높였다
기존의 스터디 관련 서비스는 시간, 장소, 관심사 등 개인적인 제약들 때문에 사용자에게 적합한 스터디를 구하는데 어려움있다. 따라서 이를 해결하기 위해 IT관련 공부를 희망하는 사람들을 대상으로 조건에 맞는 스터디 그룹을 매칭해주는 서비스를 제공하는 ITUDY(IT+STUDY)를 기획하였다. 

# 프로젝트 특징
1. 사용자 중심 디자인 적용(UCD)
2. Survey 및 Interview를 통한 needs파악
3. Affinity diagram 제작
4. SUS를 통한 사용성 평가 실시

# 개발 환경
![image](https://user-images.githubusercontent.com/52390482/92305470-beae2880-efc2-11ea-90f9-f4fa823e3bf5.png)

# 프로젝트 결과
### 1. 회원가입
![image](https://user-images.githubusercontent.com/52390482/92305484-ddacba80-efc2-11ea-9fe5-067bd110ac8d.png)

서비스의 회원 가입은 다른 서비스와 동일하게 기본적인 개인정보를 입력 받는다. 이 후 사용자의 역량을 바탕으로 그룹 참가 가능 여부를 판단하기 위한 설정을 한다. 이 설정은 사용자가 원하는 그룹을 보다 쉽게 찾을 수 있도록 필터링 해주는 지표가 되며 회원 가입 후에도 수정이 가능하다. 또한 중복 회원 가입 방지를 위한 간단한 이메일 인증 후 회원가입이 완료된다.

### 2. 클래스/스터디 검색 및 생성
![image](https://user-images.githubusercontent.com/52390482/92305527-24021980-efc3-11ea-8d2c-4a043fe93626.png)

회원가입 단계에서 설정한 지표를 바탕으로 각 그룹 마다 참가 가능 여부가 표시되며 사용자가 원하는 분야를 필터링해서 볼 수 있도록 구성했다. 모집자의 경우 모집자가 하고자하는 스터디에 필요한 구성원의 조건을 자세하게 설정할 수 있으며 참가자의 경우 이 조건을 보고 원하는 그룹에 신청을 할 수 있다. 해당 화면은 mid-fidelity에서 계획했던 대로 팝업 형태로 나타내기 위해 modal을 사용해 구현했다. 

### 3. 마이페이지
![image](https://user-images.githubusercontent.com/52390482/92305521-19478480-efc3-11ea-8326-df1e70d918e3.png)

마이페이지에서는 기본정보 수정과 그룹 관리를 할 수 있는 페이지이다. 모집자는 ‘내가올린그룹’에서 원하는 구성원을 골라 수락할 수 있으며 ‘그룹 만들기’를 할 경우 ‘참여중인그룹’으로 해당 그룹이 이동한다. 모집자를 포함한 구성원은 서로의 개인정보를 확인할 수 있으며 이를 통해 연락을 할 수 있도록 구성했다.
또한, 모집자는 신청자의 수를 알 수 있도록 항목 우측에 알람을 추가했고 ‘신청중인그룹’과 신고하기 기능을 추가하였다.

### 4. 랭킹
![image](https://user-images.githubusercontent.com/52390482/92305556-54e24e80-efc3-11ea-9601-3a84e126c99c.png)

랭킹 페이지를 통해 서비스 내에서 사용되는 가상화폐로 사용자들의 순위를 설정함으로서 사용자들간의 경쟁심을 유발시키고자 했다. 또한 칭호 시스템을 통해 해당 사용자가 얼마나 많은 활동을 했는지 판단하는 하나의 지표를 만들었다.
